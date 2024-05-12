import express from 'express';
import passport from 'passport';
import openai from '../config/openai';
import { catchAsync } from '../utils/catchAsync';
const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    const { question } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
    });

    res.json({ msg: 'Ok', answer: completion.data.choices[0].message.content });
  })
);

export default router;
