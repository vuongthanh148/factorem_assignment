import express from 'express';
import { default as projectController } from '../../controllers/project.controller.js';
import { auth } from '../../middlewares/auth.js';
import { PERMISSION_ENUM } from '../../shared/config/roles.js';

const router = express.Router();

//CUSTOMER ROUTES
router
    .route('/')
    .post(auth([PERMISSION_ENUM.CREATE_PROJECT]), projectController.createProjectByCustomer) //Customer create project

router
    .route('/customer/all')
    .get(auth([PERMISSION_ENUM.VIEW_PROJECT]), projectController.getProjectsByCustomer); //Customer get all projects created by him

router
    .route('/supplier/all')
    .get(auth([PERMISSION_ENUM.VIEW_PROJECT]), projectController.getProjectsBySupplier); //Customer get all projects created by him

router
    .route('/:id')
    .get(auth([PERMISSION_ENUM.VIEW_PROJECT]), projectController.getProjectById); //Customer get project by ID

// ADMIN ROUTES
router
    .route('/status/:id')
    .post(auth([PERMISSION_ENUM.SUPER]), projectController.updateProjectStatus);


export default router;