const express = require('express');
const messageController = require('../controllers/messageController');
const verifyAuthentication = require('../middlewares/verifyAuthentication');
const validateRole = require('../middlewares/validateRole');

const router = express.Router();

router.use(verifyAuthentication);
/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/csrfToken'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: 'INVALID_INPUT'
 *               code: '400'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', messageController.createMessage);
/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of messages to retrieve per page.
 *     responses:
 *       200:
 *         description: A list of messages with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/MessagesResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthenticatedResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', messageController.getMessages);
/**
 * @swagger
 * /api/messages:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/csrfToken'
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the message to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid request or message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthenticatedResponse'
 *       403:
 *         description: Forbidden, insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "INSUFFICIENT_ROLE"
 *               status: 403
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/', validateRole('admin'), messageController.deleteMessage);

module.exports = router;
