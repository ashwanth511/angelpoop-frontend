const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  agentType: {
    type: String,
    enum: ['entertainment', 'utility', 'social', 'defi'],
    required: true
  },
  creatorAddress: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  networkType: {
    type: String,
    enum: ['testnet', 'mainnet'],
    required: true
  },
  totalSupply: {
    type: String,
    required: true
  },
  decimals: {
    type: Number,
    required: true,
    default: 9
  },
  price: {
    type: Number,
    default: 0
  },
  priceChange24h: {
    type: Number,
    default: 0
  },
  marketCap: {
    type: Number,
    default: 0
  },
  volume24h: {
    type: Number,
    default: 0
  },
  totalValueLocked: {
    type: Number,
    default: 0
  },
  holders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema);
