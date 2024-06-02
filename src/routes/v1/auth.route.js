import express from 'express';
import authController from '../../controllers/auth.controller.js';
import { auth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { PERMISSION_ENUM } from '../../shared/config/roles.js';
import { authValidation } from '../../validations/index.js';

const router = express.Router();

router.post('/register', auth([PERMISSION_ENUM.MANAGE_USER]), validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/user', auth(), authController.getUserInfo);

export default router;
