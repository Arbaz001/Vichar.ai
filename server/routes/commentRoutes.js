const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Idea commenting system
 */

/**
 * @swagger
 * /api/ideas/{id}/comment:
 *   post:
 *     summary: Add a comment to an idea
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Idea ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "This is a great idea!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Idea not found
 */

/**
 * @swagger
 * /api/ideas/{id}/comments:
 *   get:
 *     summary: Get all comments for an idea
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Idea not found
 */

router.route('/:id/comment')
  .post(protect, addComment);

router.route('/:id/comments')
  .get(getComments);

module.exports = router;