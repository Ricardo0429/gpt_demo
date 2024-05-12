import express from 'express';

const router = express.Router();

import authRouter from './auth.route';
import contentRouter from './content.route';
import explorerRouter from './explorer.route';
import historyRouter from './history.route';
import customBrand from './custom-brand.route';
import brainstorm from './brainstorm.route';

const defaultRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/content',
    route: contentRouter,
  },
  {
    path: '/explorer',
    route: explorerRouter,
  },
  {
    path: '/history',
    route: historyRouter,
  },
  {
    path: '/brand',
    route: customBrand,
  },
  {
    path: '/brainstorm',
    route: brainstorm,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
