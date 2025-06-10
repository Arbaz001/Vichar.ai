const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function(tags) {
        return tags.length <= 5;
      },
      message: 'Cannot have more than 5 tags'
    }
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure user can't vote for their own idea
IdeaSchema.pre('save', function(next) {
  if (this.votes.includes(this.user)) {
    this.votes = this.votes.filter(vote => !vote.equals(this.user));
  }
  next();
});

module.exports = mongoose.model('Idea', IdeaSchema);