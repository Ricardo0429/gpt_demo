import express from 'express';
import passport from 'passport';
import { catchAsync } from '../utils/catchAsync';
const router = express.Router();

router.post(
  '/register',
  passport.authenticate('local-signup', { session: false }),
  catchAsync((req, res) => {
    res.json({ msg: 'Successfully registred!', token: req.user });
  })
);

router.post(
  '/login',
  passport.authenticate('local-login', { session: false }),
  catchAsync((req, res) => {
    const { user: token } = req;
    res.json({ token });
  })
);

export default router;
