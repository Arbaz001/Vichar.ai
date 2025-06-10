const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/:id/comment')
  .post(protect, addComment);

router.route('/:id/comments')
  .get(getComments);

module.exports = router;