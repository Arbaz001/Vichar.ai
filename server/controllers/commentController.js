const Comment = require('../models/Comment');
const Idea = require('../models/Idea');

// @desc    Add comment to idea
// @route   POST /api/ideas/:id/comment
const addComment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check if public or user is owner
    if (idea.visibility === 'private' && !idea.user.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to comment on this idea' });
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      user: req.user.id,
      idea: req.params.id
    });
    
    // Populate user details
    await comment.populate('user', 'username');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all comments for an idea
// @route   GET /api/ideas/:id/comments
const getComments = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check if public or user is owner
    if (idea.visibility === 'private' && !idea.user.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to view comments for this idea' });
    }
    
    const comments = await Comment.find({ idea: req.params.id })
      .populate('user', 'username')
      .sort('-createdAt');
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addComment,
  getComments
};