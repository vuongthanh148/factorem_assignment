import express from 'express';
import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import itemRoute from './item.route.js';
import projectRoute from './project.route.js';
import quotationRoute from './quotation.route.js';
import swaggerRoute from './swagger.route.js';
import userRoute from './user.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/quotation',
    route: quotationRoute,
  },
  {
    path: '/project',
    route: projectRoute,
  },
  {
    path: '/item',
    route: itemRoute,
  },
  {
    path: '/api-docs',
    route: swaggerRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
