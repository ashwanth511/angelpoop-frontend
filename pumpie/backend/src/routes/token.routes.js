const express = require('express');
const router = express.Router();
const tokenService = require('../services/token.service');

// Create a new token
router.post('/create-token', async (req, res) => {
  try {
    const token = await tokenService.createToken(req.body);
    res.json({
      success: true,
      message: 'Token created successfully',
      token
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
    const tokens = await tokenService.getAllTokens();
    res.json({
      success: true,
      tokens
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
    const token = await tokenService.getTokenById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    res.json({
      success: true,
      token
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
    const token = await tokenService.updateTokenAddress(req.params.id, req.body.address);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Error updating token address:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update token address'
    });
  }
});

// Update token pool status
router.patch('/token/:id/pool', async (req, res) => {
  try {
    const token = await tokenService.updateTokenPool(req.params.id, req.body);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Error updating token pool status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update token pool status'
    });
  }
});

module.exports = router;
