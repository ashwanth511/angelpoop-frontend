const express = require('express');
const router = express.Router();
const Token = require('../models/token.model');

// Create a new token
router.post('/create-token', async (req, res) => {
  try {
    const token = new Token(req.body);
    const savedToken = await token.save();
    const tokenObj = savedToken.toObject();
    res.json({
      success: true,
      message: 'Token created successfully',
      token: {
        ...tokenObj,
        id: tokenObj._id
      }
    });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create token'
    });
  }
});

// Get all tokens
router.get('/tokens', async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      tokens: tokens.map(token => {
        const tokenObj = token.toObject();
        return {
          ...tokenObj,
          id: tokenObj._id
        };
      })
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch tokens'
    });
  }
});

// Get token by ID
router.get('/token/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    const tokenObj = token.toObject();
    res.json({
      success: true,
      token: {
        ...tokenObj,
        id: tokenObj._id
      }
    });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch token'
    });
  }
});

// Update token address
router.patch('/token/:id/address', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { creatorAddress: req.body.address },
      { new: true }
    );
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    const tokenObj = token.toObject();
    res.json({
      success: true,
      token: {
        ...tokenObj,
        id: tokenObj._id
      }
    });
  } catch (error) {
    console.error('Error updating token address:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update token address'
    });
  }
});

module.exports = router;
