import express from 'express';
import quotationController from '../../controllers/quotation.controller.js';
import { auth } from '../../middlewares/auth.js';
import { PERMISSION_ENUM } from '../../shared/config/roles.js';

const router = express.Router();

// SUPPLIER ROUTES

router
    .route('/')
    .post(auth([PERMISSION_ENUM.CREATE_QUOTATION]), quotationController.createQuotation)

router
    .route('/delete/:quotationId')
    .post(auth([PERMISSION_ENUM.DELETE_QUOTATION]), quotationController.deleteQuotation)

router
    .route('/delete-bulk')
    .post(auth([PERMISSION_ENUM.DELETE_QUOTATION]), quotationController.deleteListQuotation)


// .get(auth([PERMISSION_ENUM.SUPER]), quotationController.getAllProjects);

router
    .route('/accept/:quotationId')
    //Supplier accept quotation
    .post(auth([PERMISSION_ENUM.ACCEPT_QUOTATION]), quotationController.acceptQuotation);

router
    .route('/supplier/all')
    //Supplier accept quotation
    .get(auth([PERMISSION_ENUM.VIEW_QUOTATION]), quotationController.getAllQuotationBySupplier);

// ADMIN ROUTES
router
    .route('/status/:quotationId')
    //Admin approve quotation
    .post(auth([PERMISSION_ENUM.SUPER]), quotationController.updateQuotationStatus);

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