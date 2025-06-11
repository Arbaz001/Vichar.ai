const express = require('express');
const { getAIFeedback } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

// Hugging Face Rate Limit (30 requests/15 mins)
const hfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many AI requests! Try again after 15 minutes"
});

const router = express.Router();
router.post('/ideas/:id/feedback', protect, hfLimiter, getAIFeedback);

module.exports = router;