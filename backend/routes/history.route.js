import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
import { contentController } from '../controllers';
const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  catchAsync(async (req, res) => {
    const history = await contentController.getContentsByUserId(req.user);
    res.json({ history });
  })
);

export default router;
