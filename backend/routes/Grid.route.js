const express = require('express');
const gridController = require('../controllers/gridController');

const router = express.Router();

/**
 * @swagger
 * /api/grid:
 *   post:
 *     summary: Create a new grid
 *     tags: [Grid]
 *     parameters:
 *       - $ref: '#/components/parameters/csrfToken'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grid
 *             properties:
 *               grid:
 *                 $ref: '#/components/schemas/Grid'
 *     responses:
 *       201:
 *         description: Grid created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grid'
 *       400:
 *         description: Invalid grid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: INVALID_INPUT
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', gridController.createGrid);

module.exports = router;
