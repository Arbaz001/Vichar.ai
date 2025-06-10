const Idea = require('../models/Idea');

// @desc    Get all public ideas
// @route   GET /api/ideas
const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ visibility: 'public' })
      .populate('user', 'username')
      .sort('-createdAt');
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get ideas by logged-in user
// @route   GET /api/ideas/my
const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user.id })
      .sort('-createdAt');
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single idea
// @route   GET /api/ideas/:id
const getIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('user', 'username')
      .populate('votes', 'username');
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check if idea is private and not owned by user
    if (idea.visibility === 'private' && !idea.user._id.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to view this idea' });
    }
    
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new idea
// @route   POST /api/ideas
const createIdea = async (req, res) => {
  try {
    const { title, description, tags, visibility } = req.body;
    
    const idea = await Idea.create({
      title,
      description,
      tags,
      visibility,
      user: req.user.id
    });
    
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update idea
// @route   PUT /api/ideas/:id
const updateIdea = async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check ownership
    if (!idea.user.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to update this idea' });
    }
    
    idea = await Idea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check ownership
    if (!idea.user.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to delete this idea' });
    }
    
    await Idea.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Toggle vote on idea
// @route   POST /api/ideas/:id/vote
const toggleVote = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check if public or user is owner
    if (idea.visibility === 'private' && !idea.user.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to vote on this idea' });
    }
    
    // Check if user already voted
    const voteIndex = idea.votes.findIndex(vote => vote.equals(req.user.id));
    
    if (voteIndex >= 0) {
      // Remove vote
      idea.votes.splice(voteIndex, 1);
    } else {
      // Add vote
      idea.votes.push(req.user.id);
    }
    
    await idea.save();
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get popular ideas
// @route   GET /api/ideas/popular
const getPopularIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ visibility: 'public' })
      .populate('user', 'username')
      .sort({ votes: -1, createdAt: -1 })
      .limit(10);
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get trending ideas
// @route   GET /api/ideas/trending
const getTrendingIdeas = async (req, res) => {
  try {
    // Trending is based on votes and recency (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const ideas = await Idea.aggregate([
      {
        $match: {
          visibility: 'public',
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $addFields: {
          voteCount: { $size: "$votes" }
        }
      },
      {
        $sort: { voteCount: -1, createdAt: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0
        }
      }
    ]);
    
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getIdeas,
  getMyIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleVote,
  getPopularIdeas,
  getTrendingIdeas
};