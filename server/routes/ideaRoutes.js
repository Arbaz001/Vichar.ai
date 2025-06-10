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
  getTrendingIdeas
} = require('../controllers/ideaController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

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

module.exports = router;