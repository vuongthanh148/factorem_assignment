import express from 'express';
import userController from '../../controllers/user.controller.js';
import { auth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { PERMISSION_ENUM } from '../../shared/config/roles.js';
import userValidation from '../../validations/user.validation.js';

const router = express.Router();

router
  .route('/')
  .get(auth([PERMISSION_ENUM.MANAGE_USER]), validate(userValidation.getUsers), userController.getUsers);

export default router;