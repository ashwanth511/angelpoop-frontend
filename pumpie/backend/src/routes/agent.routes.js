const express = require('express');
const router = express.Router();
const Agent = require('../models/agent.model');
const llmService = require('../services/llm.service');
const Token = require('../models/token.model');

// Create a new agent
router.post('/create-agent', async (req, res) => {
  try {
    console.log('Creating agent with data:', req.body);

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ tokenId: req.body.tokenId });
    if (existingAgent) {
      // Update existing agent
      existingAgent.agentType = req.body.agentType;
      existingAgent.personality = req.body.personality;
      existingAgent.context = req.body.context;
      existingAgent.lastActive = new Date();
      
      const savedAgent = await existingAgent.save();
      return res.json({
        success: true,
        message: 'AI Agent updated successfully',
        agent: savedAgent.toObject()
      });
    }

    // Create new agent
    const agent = new Agent({
      tokenId: req.body.tokenId,
      agentType: req.body.agentType,
      personality: req.body.personality || {},
      context: req.body.context || [],
      lastActive: new Date()
    });

    const savedAgent = await agent.save();
    res.json({
      success: true,
      message: 'AI Agent created successfully',
      agent: savedAgent.toObject()
    });
  } catch (error) {
    console.error('Error creating/updating agent:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create/update agent'
    });
  }
});

// Get agent by token ID
router.get('/agent/:tokenId', async (req, res) => {
  try {
    const agent = await Agent.findOne({ tokenId: req.params.tokenId });
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    // Get associated token info
    const token = await Token.findById(req.params.tokenId);

    res.json({
      success: true,
      agent: {
        ...agent.toObject(),
        tokenInfo: token ? token.toObject() : null
      }
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch agent'
    });
  }
});

// Chat with agent
router.post('/agent/:tokenId/chat', async (req, res) => {
  try {
    console.log('Chat request:', req.params.tokenId, req.body);

    const agent = await Agent.findOne({ tokenId: req.params.tokenId });
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    // Get AI response
    const response = await llmService.handleUserQuery(agent, req.body.message);
    console.log('AI response:', response);

    // Store conversation
    const userMessage = {
      role: 'user',
      content: req.body.message,
      timestamp: new Date(),
      address: req.body.address
    };

    const aiMessage = {
      role: 'agent',
      content: response,
      timestamp: new Date()
    };

    agent.conversations.push(userMessage, aiMessage);
    agent.lastActive = new Date();
    await agent.save();

    res.json({
      success: true,
      message: 'Chat processed successfully',
      response: response
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat'
    });
  }
});

// Connect Twitter account
router.post('/agent/:tokenId/twitter/connect', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { accessToken, refreshToken, username } = req.body;

    // Find the agent
    const agent = await Agent.findOne({ tokenId });
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    // Update agent with Twitter credentials
    agent.twitter = {
      accessToken,
      refreshToken,
      username,
      authorized: true,
      lastTweetAt: new Date()
    };

    // Enable posting schedule by default
    agent.postingSchedule = {
      enabled: true,
      frequency: 'daily',
      lastPostTime: new Date()
    };

    await agent.save();

    res.json({
      success: true,
      message: 'Twitter account connected successfully'
    });
  } catch (error) {
    console.error('Error connecting Twitter:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect Twitter account'
    });
  }
});

// Update posting schedule
router.post('/agent/:tokenId/twitter/schedule', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { enabled, frequency } = req.body;

    const agent = await Agent.findOne({ tokenId });
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    agent.postingSchedule = {
      enabled,
      frequency,
      lastPostTime: agent.postingSchedule?.lastPostTime || new Date()
    };

    await agent.save();

    res.json({
      success: true,
      message: 'Posting schedule updated successfully'
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update posting schedule'
    });
  }
});

module.exports = router;
