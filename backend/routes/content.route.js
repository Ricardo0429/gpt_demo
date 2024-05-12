import express from 'express';
import passport from 'passport';
import openai from '../config/openai';
import { contentController } from '../controllers';
import { catchAsync } from '../utils/catchAsync';
const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const contents = await contentController.getContentsByUserId(req.user._id);
  res.json({ contents });
});

router.post(
  '/',
  catchAsync(async (req, res) => {
    try {
      const { archytype, prompt, options } = req.body;
      const customPrompt = {};
      if (options && Object.keys(options)?.length) {
        const { inclusion, exclusion, personas, format } = options;
        customPrompt.personas = personas;
        customPrompt.format = format;
        customPrompt.inclusion = inclusion.split(',').filter((item) => {
          if (item.length) {
            return item.trim();
          }
        });

        customPrompt.exclusion = exclusion.split(',').filter((item) => {
          if (item.length) {
            return item.trim();
          }
        });
      }
      let template;
      const customTemplate = `You need to include '${customPrompt.inclusion.join(
        ','
      )}' and you must not include '${customPrompt.exclusion.join(',')}.'`;
      const format = customPrompt.format === 'email' ? customPrompt.format : `${customPrompt.format} post`;

      const adCopyTemplate = `Using the following framework provided by Google, create compelling ${format} that highlights ${prompt}. Field	Max length Headline 1	30 characters Headline 2	30 characters Headline 3	30 characters Description 1	90 characters Description 2	90 characters`;

      template = `Write a ${format} in ${archytype} tone to ${customPrompt.personas} persona on ${prompt}. ${customTemplate}`;

      if (customPrompt.format === 'Google ad copy') {
        template = `${adCopyTemplate}. ${customTemplate}`;
      }

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: template }],
      });

      res.json({ msg: 'Successfully registred!', text: completion.data.choices[0].message.content });
    } catch (error) {
      res.json({ error });
    }
  })
);

export default router;
