const express = require('express');
const { getAIFeedback } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const hfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many AI requests! Try again after 15 minutes"
});

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI Feedback
 *   description: AI-powered idea analysis
 */

/**
 * @swagger
 * /api/ideas/{id}/feedback:
 *   post:
 *     summary: Get AI feedback for an idea
 *     tags: [AI Feedback]
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
 *         description: AI analysis of the idea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   example: "This idea solves a common problem in an innovative way"
 *                 pros:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Innovative approach", "Large target market"]
 *                 cons:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["High competition", "Requires significant funding"]
 *                 rating:
 *                   type: number
 *                   format: float
 *                   example: 8.5
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Idea not found
 *       429:
 *         description: Too many requests (rate limit exceeded)
 */
router.post('/ideas/:id/feedback', protect, hfLimiter, getAIFeedback);

module.exports = router;