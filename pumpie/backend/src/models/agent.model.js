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
  },
  twitter: {
    accessToken: String,
    refreshToken: String,
    username: String,
    authorized: {
      type: Boolean,
      default: false
    },
    lastTweetAt: Date
  },
  postingSchedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    lastPostTime: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);
