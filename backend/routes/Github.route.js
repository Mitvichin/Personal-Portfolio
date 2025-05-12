const express = require('express');
const githubController = require('../controllers/githubController');

const router = express.Router();

/**
 * @swagger
 * /api/github/get-file-content:
 *   get:
 *     summary: Search and fetch content of a file from a GitHub repository
 *     tags: [GitHub]
 *     parameters:
 *       - in: query
 *         name: searchWord
 *         required: true
 *         schema:
 *           type: string
 *         description: Word or phrase to search for within the repo
 *       - in: query
 *         name: filePath
 *         required: true
 *         schema:
 *           type: string
 *         description: Relative path to the file from the project root (e.g. "/src/index.js")
 *     responses:
 *       200:
 *         description: File content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Raw text content of the file
 *                   example: "import React from 'react';"
 *                 url:
 *                   type: string
 *                   description: GitHub URL to the file
 *                   example: "https://github.com/username/repo/blob/main/src/index.js"
 *       400:
 *         description: Missing or invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: INVALID_QUERY_PARAMETERS
 *       404:
 *         description: File not found in the repository
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: NOT_FOUND
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/get-file-content', githubController.getFileContent);

module.exports = router;
