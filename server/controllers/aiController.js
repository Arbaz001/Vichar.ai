const { generateFeedback } = require('../utils/aiFeedback');
const Idea = require('../models/Idea');

//Generate AI feedback for an idea
//POST /api/ideas/:id/feedback
const getAIFeedback = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check ownership
    if (!idea.user.equals(req.user.id)) {
      return res.status(401).json({ error: 'Not authorized to get feedback for this idea' });
    }
    
    const feedback = await generateFeedback(req.params.id);
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate AI feedback' });
  }
};

module.exports = { getAIFeedback };