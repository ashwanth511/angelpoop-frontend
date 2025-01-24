const { TwitterApi } = require('twitter-api-v2');
const Agent = require('../models/agent.model');
const Token = require('../models/token.model');
const llmService = require('./llm.service');

class TwitterService {
  constructor() {
    this.checkAndPostUpdates();
    // Check for updates every 15 minutes
    setInterval(() => this.checkAndPostUpdates(), 15 * 60 * 1000);
  }

  async checkAndPostUpdates() {
    try {
      const agents = await Agent.find({
        'twitter.authorized': true,
        'postingSchedule.enabled': true
      });

      for (const agent of agents) {
        await this.processAgentUpdates(agent);
      }
    } catch (error) {
      console.error('Error checking for Twitter updates:', error);
    }
  }

  async processAgentUpdates(agent) {
    try {
      const now = new Date();
      const lastPost = agent.postingSchedule.lastPostTime || new Date(0);
      const frequency = agent.postingSchedule.frequency;

      // Check if it's time to post based on frequency
      if (!this.shouldPost(lastPost, frequency)) {
        return;
      }

      // Get token info
      const token = await Token.findById(agent.tokenId);
      if (!token) {
        console.error(`Token not found for agent: ${agent.tokenId}`);
        return;
      }

      // Get token-specific stats and info
      const tokenStats = {
        name: token.name,
        symbol: token.symbol,
        price: token.price || 0,
        priceChange24h: token.priceChange24h || 0,
        volume24h: token.volume24h || 0,
        holders: token.holders || 0,
        liquidityProgress: token.liquidityProgress || 0
      };

      // Generate context for the tweet
      const context = [
        `You are the official Twitter agent for ${token.name} ($${token.symbol}).`,
        `Your purpose is to keep the community updated about ${token.name} only.`,
        `You have access to these real-time stats:`,
        `- Current Price: ${tokenStats.price} TON`,
        `- 24h Change: ${tokenStats.priceChange24h}%`,
        `- 24h Volume: ${tokenStats.volume24h} TON`,
        `- Holders: ${tokenStats.holders}`,
        `- Liquidity Progress: ${tokenStats.liquidityProgress}%`,
        token.description ? `Project Description: ${token.description}` : '',
        `Remember: Only tweet about ${token.name}. Never mention other tokens.`
      ].filter(Boolean);

      // Generate tweet content using Google AI
      const tweetContent = await llmService.generateTweet(context.join('\n'));

      // Post to Twitter
      await this.postTweet(agent, tweetContent);

      // Update last post time
      agent.postingSchedule.lastPostTime = now;
      agent.twitter.lastTweetAt = now;
      await agent.save();

      console.log(`Successfully posted update for ${token.name} ($${token.symbol})`);
    } catch (error) {
      console.error(`Error processing updates for agent ${agent.tokenId}:`, error);
    }
  }

  shouldPost(lastPost, frequency) {
    const now = new Date();
    const hours = Math.abs(now - lastPost) / 36e5; // Convert to hours

    switch (frequency) {
      case 'hourly':
        return hours >= 1;
      case 'daily':
        return hours >= 24;
      case 'weekly':
        return hours >= 168;
      default:
        return false;
    }
  }

  async postTweet(agent, content) {
    try {
      const client = new TwitterApi({
        accessToken: agent.twitter.accessToken,
        accessSecret: agent.twitter.accessSecret
      });

      await client.v2.tweet(content);
      console.log(`Posted tweet for agent ${agent.tokenId}`);
    } catch (error) {
      console.error(`Error posting tweet for agent ${agent.tokenId}:`, error);
      throw error;
    }
  }
}

module.exports = new TwitterService();
