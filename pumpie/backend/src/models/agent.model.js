const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  agentType: {
    type: String,
    required: true,
    enum: ['entertainment', 'utility', 'social', 'defi']
  },
  personality: {
    type: Object,
    required: true
  },
  context: [{
    type: String
  }],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);
