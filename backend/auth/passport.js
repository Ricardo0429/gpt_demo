import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import path from 'path';
import dotenv from 'dotenv';

import userService from '../services/user.service';
import { loginUserWithEmailAndPassword } from '../services/auth.service';
import { getUserById } from '../services/user.service';
import { generateJWTToken } from '../auth/helpers';

dotenv.config({ path: path.join(__dirname, '../.env') });

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  'local-signup',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, emailInput, passwordInput, done) => {
      const { name } = req.body;
      const payload = { name, email: emailInput, password: passwordInput };
      try {
        const user = await userService.createUser(payload);
        if (user) {
          return done(null, user);
        } else {
          return done('Sign up error!', null);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    let user;
    try {
      user = await loginUserWithEmailAndPassword(email, password);
    } catch (error) {
      done(error);
    }

    if (!user) return done('No user found with that email address.', null);

    const { _id: id, name } = user;

    const options = {
      expiresIn: 3600,
    };

    const token = generateJWTToken({ id, name }, options);
    return done(null, token);
  })
);

passport.use(
  'jwt',
  new JWTStrategy(
    { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.JWT_SECRET },
    async (jwtPayload, done) => {
      const { id } = jwtPayload;
      try {
        const user = await getUserById(id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
