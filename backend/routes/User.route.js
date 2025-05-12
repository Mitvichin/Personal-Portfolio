const express = require('express');
const userController = require('../controllers/userController');
const verifyAuthentication = require('../middlewares/verifyAuthentication');
const validateRole = require('../middlewares/validateRole');

const router = express.Router();

router.use(verifyAuthentication, validateRole('admin'));
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a paginated list of users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/UsersResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthenticatedResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: INSUFFICIENT_ROLE
 *               status: 403
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', userController.getUsers);
/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/csrfToken'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthenticatedResponse'
 *       403:
 *         description: Forbidden - Cannot delete admin users or insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: ACTION_FORBIDDEN
 *               status: 403
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: NOT_FOUND
 *               status: 404
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/', userController.deleteUserById);

module.exports = router;
