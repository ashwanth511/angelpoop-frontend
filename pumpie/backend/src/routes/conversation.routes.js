const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation.model');

// Get conversations for a specific token
router.get('/conversations/:tokenId', async (req, res) => {
    try {
        const conversations = await Conversation.findOne({ tokenId: req.params.tokenId });
        res.json({ 
            success: true, 
            conversations: conversations || { tokenId: req.params.tokenId, messages: [] }
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch conversations.' });
    }
});

// Store a new message in a conversation
router.post('/conversations', async (req, res) => {
    try {
        const { tokenId, message, response } = req.body;
        if (!tokenId || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'TokenId and message are required.' 
            });
        }

        let conversation = await Conversation.findOne({ tokenId });
        if (!conversation) {
            conversation = new Conversation({ 
                tokenId, 
                messages: [] 
            });
        }

        // Add messages
        if (message) {
            conversation.messages.push({
                role: message.role,
                content: message.content,
                address: message.address,
                timestamp: message.timestamp || new Date()
            });
        }

        if (response) {
            conversation.messages.push({
                role: response.role,
                content: response.content,
                timestamp: response.timestamp || new Date()
            });
        }

        await conversation.save();
        res.json({ success: true, conversation });
    } catch (error) {
        console.error('Error storing conversation:', error);
        res.status(500).json({ success: false, error: 'Failed to store conversation.' });
    }
});

module.exports = router;
