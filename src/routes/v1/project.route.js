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
    .route('/all')
    .get(auth([PERMISSION_ENUM.VIEW_PROJECT]), projectController.getProjectsByCustomer); //Customer get all projects created by him

router
    .route('/:id')
    .get(auth([PERMISSION_ENUM.VIEW_PROJECT]), projectController.getProjectById); //Customer get project by ID

// ADMIN ROUTES
router
    .route('/status/:id')
    .post(auth([PERMISSION_ENUM.SUPER]), projectController.updateProjectStatus);


export default router;
/**
 * @swagger
 * tags:
 *   name: Project
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /project:
 *   post:
 *     summary: Create a new project
 *     description: Customer create new project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /project/user/{id}:
 *   get:
 *     summary: Get projects by user ID
 *     description: Retrieve all projects associated with a specific user ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       "404":
 *         description: No projects found for user
 */