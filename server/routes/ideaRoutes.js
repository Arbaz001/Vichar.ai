const express = require('express');
const {
  getIdeas,
  getMyIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleVote,
  getPopularIdeas,
  getTrendingIdeas,
  exportIdeaPDF
} = require('../controllers/ideaController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ideas
 *   description: Idea management endpoints
 */

/**
 * @swagger
 * /api/ideas:
 *   get:
 *     summary: Get all public ideas
 *     tags: [Ideas]
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
 *         description: Number of ideas per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering ideas
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Idea'
 *       500:
 *         description: Server error
 * 
 *   post:
 *     summary: Create a new idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdeaInput'
 *     responses:
 *       201:
 *         description: Idea created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Please include a title and description"
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/ideas/my:
 *   get:
 *     summary: Get current user's ideas (both public and private)
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular]
 *           default: newest
 *         description: Sorting criteria
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Idea'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/ideas/popular:
 *   get:
 *     summary: Get ideas sorted by most votes
 *     tags: [Ideas]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of ideas to return
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Idea'
 */

/**
 * @swagger
 * /api/ideas/trending:
 *   get:
 *     summary: Get trending ideas (most engagement in last 7 days)
 *     tags: [Ideas]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Idea'
 */

/**
 * @swagger
 * /api/ideas/{id}:
 *   get:
 *     summary: Get idea details by ID
 *     tags: [Ideas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       404:
 *         description: Idea not found
 * 
 *   put:
 *     summary: Update an idea
 *     tags: [Ideas]
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
 *             $ref: '#/components/schemas/IdeaInput'
 *     responses:
 *       200:
 *         description: Idea updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not idea owner)
 *       404:
 *         description: Idea not found
 * 
 *   delete:
 *     summary: Delete an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Idea deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not idea owner)
 *       404:
 *         description: Idea not found
 */

/**
 * @swagger
 * /api/ideas/{id}/vote:
 *   post:
 *     summary: Upvote/downvote an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Vote operation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Idea not found
 */

/**
 * @swagger
 * /api/ideas/{id}/export:
 *   get:
 *     summary: Export idea details as PDF
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Idea not found
 */

router.route('/')
  .get(getIdeas)
  .post(protect, createIdea);

router.get('/my', protect, getMyIdeas);
router.get('/popular', getPopularIdeas);
router.get('/trending', getTrendingIdeas);

router.route('/:id')
  .get(getIdea)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

router.post('/:id/vote', protect, toggleVote);
router.get('/:id/export', protect, exportIdeaPDF);


module.exports = router;