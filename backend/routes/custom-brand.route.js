import express from 'express';
import passport from 'passport';
import multer from 'multer';
import openai from '../config/openai';
import { storage } from '../utils/upload';
import { catchAsync } from '../utils/catchAsync';
import { updateUserById } from '../services/user.service';
import { run, chatWithCustomFile } from '../utils/pinecone-client';
import { selectArchetype } from '../middlewares/select-archetype';
const router = express.Router();

const uploadStorage = multer({ storage: storage });

router.post(
  '/archetype',
  passport.authenticate('jwt', { session: false }),
  catchAsync((req, res) => {
    const { archetype } = req.user;
    console.log(archetype);
    res.json({ archetype });
  })
);

router.post(
  '/',
  uploadStorage.single('brand'),
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    await run(req.file.path, req.user._id);
    const initial = 'please describe about the details of this brand`s archetype description';
    const answer = await chatWithCustomFile(initial, req.user._id);
    await updateUserById(req.user._id, { mybrand: answer.text });
    res.json({ msg: 'Uploaded!' });
  })
);

router.post(
  '/chat',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    const { archetype, mybrand } = req.user;
    const { question } = req.body;
    let template;
    if (archetype === 'My brand') {
      template = `Here is my brand archeytype's description. ${mybrand}. ${question}`;
    } else {
      template = `My brand archetype is archetype. ${question}`;
    }
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: template }],
    });

    res.json({ msg: 'Ok', answer: completion.data.choices[0].message.content });
  })
);

router.put(
  '/archetype',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    const { archetype } = req.body;
    if (archetype) {
      await updateUserById(req.user._id, { archetype });
    }
    res.json({ msg: 'Saved!' });
  })
);

export default router;
