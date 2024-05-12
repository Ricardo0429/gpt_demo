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
      const { archytype, prompt, options: oopttions } = req.body;


      const customPrompt = {};
      if (oopttions && Object.keys(oopttions)?.length) {
        const { inclusion, exclusion, personas, format } = oopttions;
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
