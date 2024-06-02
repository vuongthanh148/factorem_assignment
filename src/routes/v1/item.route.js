import express from 'express';
import itemController from '../../controllers/item.controller.js';
import { auth } from '../../middlewares/auth.js';
import { PERMISSION_ENUM } from '../../shared/config/roles.js';

const router = express.Router();

//CUSTOMER ROUTES

// ADMIN ROUTES
router
    .route('/status/:id')
    .post(auth([PERMISSION_ENUM.SUPER]), itemController.updateItemStatus);


export default router;