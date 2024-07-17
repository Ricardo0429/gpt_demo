import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
import { contentController } from '../controllers';
import openai from '../config/openai';
import formatKeywords from '../utils/formatKeywords';
const router = express.Router();

router.post(
  '/email',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    const { recipient, email, personas, inclusion, exclusion, content } = req.body;
    const { archetype, mybrand } = req.user;
    const keywords = formatKeywords(inclusion, exclusion);
    const customTemplate = `You need to include '${keywords.inclusion.join(
      ','
    )}' and you must not include '${keywords.exclusion.join(',')}.'`;

    let prompt;
    if (archetype === 'My brand') {
      prompt = `Here is my brand archeytype's description. '${mybrand}' Write a ${email} email in my brand archetype's tone to ${personas} persona - ${recipient} on ${content}. ${customTemplate}`;
    } else {
      prompt = `Write a ${email} email in ${archetype} tone to ${personas} persona - ${recipient} on ${content}. ${customTemplate}`;
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    await contentController.addContents({
      userId: req.user,
      prompt: content,
      answer: completion.data.choices[0].message.content,
    });

    res.json({ answer: completion.data.choices[0].message.content });
  })
);

router.post(
  '/blog',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    try {
      const { content, inclusion, personas, wordCount, keyQuestions, topic } = req.body;
      const { archetype, mybrand } = req.user;

      const keywords = formatKeywords(inclusion);
      const customTemplate = `You need to include '${keywords.inclusion.join(',')}'`;

      let prompt;
      if (archetype === 'My brand') {
        prompt = `Here is my brand archeytype's description. '${mybrand}' Write a blog of ${topic} topic in my brand archetype's tone to ${personas} persona on ${content}.  The including word counts is ${wordCount} ${customTemplate}`;
      } else {
        prompt = `Write a blog of ${topic} topic in ${archetype} tone to ${personas} persona on ${content}. The including word counts is ${wordCount} ${customTemplate}`;
      }

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      res.json({ answer: completion.data.choices[0].message.content });
    } catch (error) {
      throw new Error(error);
    }
  })
);

router.post(
  '/social',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    try {
      const { content, socialType, personas, inclusion, exclusion, output } = req.body;
      const { archetype, mybrand } = req.user;
      let maxC = 0;
      switch (socialType) {
        case 'Twitter':
          maxC = 280;
          break;
        case 'Facebook':
          maxC = 2000;
          break;
        case 'LinkedIn':
          maxC = 3000;
          break;
        case 'Instagram':
          maxC = 700;
          break;

        default:
          break;
      }

      const keywords = formatKeywords(inclusion, exclusion);
      const customTemplate = `You need to include '${keywords.inclusion.join(
        ','
      )}' and you must not include '${keywords.exclusion.join(',')}.'`;

      let prompt;
      if (archetype === 'My brand') {
        prompt = `Here is my brand archeytype's description. '${mybrand}' Write a ${socialType} post in my brand archetype's tone to ${personas} persona on ${content}. ${customTemplate}`;
      } else {
        prompt = `Write a ${socialType} post in ${archetype} tone to ${personas} persona on ${content}. ${customTemplate}. Maximum letter counts are ${maxC}`;
      }

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      res.json({ answer: completion.data.choices[0].message.content });
    } catch (error) {
      console.log(error);
    }
  })
);

router.post(
  '/best',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    try {
      const { content, socialType, personas, inclusion, exclusion, output } = req.body;
      const { archetype, mybrand } = req.user;
      let maxC = 0;
      switch (socialType) {
        case 'Twitter':
          maxC = 280;
          break;
        case 'Facebook':
          maxC = 2000;
          break;
        case 'LinkedIn':
          maxC = 3000;
          break;
        case 'Instagram':
          maxC = 700;
          break;

        default:
          break;
      }

      const keywords = formatKeywords(inclusion, exclusion);
      const customTemplate = `You need to include '${keywords.inclusion.join(
        ','
      )}' and you must not include '${keywords.exclusion.join(',')}.'`;

      let prompt;
      if (archetype === 'My brand') {
        prompt = `Here is my brand archeytype's description. '${mybrand}' Write a ${socialType} post in my brand archetype's tone to ${personas} persona on ${content}. ${customTemplate}`;
      } else {
        prompt = `Write a ${socialType} post in ${archetype} tone to ${personas} persona on ${content}. ${customTemplate}. Maximum letter counts are ${maxC}`;
      }

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      res.json({ answer: completion.data.choices[0].message.content });
    } catch (error) {
      console.log(error);
    }
  })
);

router.post(
  '/ad-copy',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    try {
      const { content, personas, inclusion, exclusion, output } = req.body;
      const { archetype, mybrand } = req.user;
      const keywords = formatKeywords(inclusion, exclusion);
      const customTemplate = `You need to include '${keywords.inclusion.join(
        ','
      )}' and you must not include '${keywords.exclusion.join(',')}.'`;
      let adCopyTemplate;
      let prompt;

      if (archetype === 'My brand') {
        prompt = `Here is my brand archeytype's description. '${mybrand}' Using the following framework provided by Google, create compelling Google Ad Copy that highlights ${content} in my brand archetype's tone. Field	Max length Headline 1	30 characters Headline 2	30 characters Headline 3	30 characters Description 1	90 characters Description 2	90 characters`;
      } else {
        adCopyTemplate = `Using the following framework provided by Google, create compelling Google Ad Copy that highlights ${content} in ${archetype} tone. Field	Max length Headline 1	30 characters Headline 2	30 characters Headline 3	30 characters Description 1	90 characters Description 2	90 characters`;
        prompt = `${adCopyTemplate}. ${customTemplate}`;
      }

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      res.json({ answer: completion.data.choices[0].message.content });
    } catch (error) {
      console.log(error);
    }
  })
);

export default router;
