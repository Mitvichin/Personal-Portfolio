const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     parameters:
 *       - $ref: '#/components/parameters/csrfToken'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: INVALID_INPUT
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/register', authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and issue JWT tokens
 *     tags: [Auth]
 *     parameters:
 *       - $ref: '#/components/parameters/csrfToken'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'alice@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Login successful, JWT tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              code: 400
 *              message: INVALID_CREDENTIALS
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', authController.login);
/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the user and clear JWT tokens
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Logout successful, JWT tokens cleared
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/logout', authController.logout);
/**
 * @swagger
 * /api/auth/verify-authentication:
 *   get:
 *     summary: Verify if the user is authenticated via the JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthenticatedResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/verify-authentication', authController.verifyAuthentication);
/**
 * @swagger
 * /api/auth/csrf-token:
 *   get:
 *     summary: Get the CSRF token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: CSRF token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CSRFResponse'
 *       403:
 *         description: CSRF token error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/csrf-token', authController.getCSRF);
/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     summary: Refresh the JWT token using the refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthenticatedResponse'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/refresh', authController.refreshAuthToken);

module.exports = router;
