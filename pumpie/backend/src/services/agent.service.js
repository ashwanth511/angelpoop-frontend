const llmService = require('./llm.service');

class AgentService {
  constructor() {
    this.agentTypes = {
      entertainment: {
        personality: "friendly, casual, and entertaining",
        context: "You are an entertainment-focused AI agent. Be engaging, fun, and informative while maintaining a casual tone.",
        languages: ["English", "Spanish", "French", "Japanese"],
        features: ["Jokes", "Fun Facts", "Trivia", "Entertainment News"]
      },
      utility: {
        personality: "professional, efficient, and helpful",
        context: "You are a utility-focused AI agent. Provide clear, concise, and accurate information with a focus on practical use cases.",
        languages: ["English"],
        features: ["Technical Info", "Usage Guide", "Problem Solving", "Integration Help"]
      },
      defi: {
        personality: "professional, analytical, and precise",
        context: "You are a DeFi-focused AI agent. Provide accurate financial information and analysis while maintaining professionalism.",
        languages: ["English"],
        features: ["Price Analysis", "Market Trends", "Trading Info", "Risk Assessment"]
      },
      social: {
        personality: "friendly, engaging, and community-focused",
        context: "You are a social-focused AI agent. Foster community engagement and provide helpful information in a friendly manner.",
        languages: ["English", "Spanish", "French"],
        features: ["Community Updates", "Event Info", "User Engagement", "Social Features"]
      }
    };
  }

  async createAgent(tokenData) {
    const agentType = this.agentTypes[tokenData.agentType];
    if (!agentType) {
      throw new Error('Invalid agent type');
    }

    // Generate agent personality
    const personalityPrompt = `
      Create an AI agent personality for a token with these details:
      Name: ${tokenData.name}
      Type: ${tokenData.agentType}
      Description: ${tokenData.description}
      
      Base Personality: ${agentType.personality}
      Context: ${agentType.context}
      
      Return a JSON object with:
      1. personality traits
      2. communication style
      3. knowledge areas
      4. response format
    `;

    const personality = await llmService.generateResponse(personalityPrompt, []);

    // Generate initial context
    const contextPrompt = `
      Based on this token information:
      ${JSON.stringify(tokenData)}
      
      Generate 5 key points about the token that would be useful for the AI agent.
      Consider: purpose, utility, target audience, features, and market position.
      
      Format as JSON array of strings.
    `;

    const context = await llmService.generateResponse(contextPrompt, []);

    return {
      tokenId: tokenData.id,
      name: tokenData.name,
      agentType: tokenData.agentType,
      description: tokenData.description,
      personality: JSON.parse(personality),
      context: JSON.parse(context),
      supportedLanguages: agentType.languages,
      features: agentType.features
    };
  }

  async handleChat(agent, message, userAddress) {
    const chatContext = [
      {
        role: "system",
        content: `
          You are an AI agent for the token "${agent.name}".
          Agent Type: ${agent.agentType}
          Personality: ${JSON.stringify(agent.personality)}
          Token Context: ${JSON.stringify(agent.context)}
          
          Respond in a way that matches your personality and provides accurate information.
          Focus on your specific agent type: ${this.agentTypes[agent.agentType].context}
        `
      }
    ];

    // Add recent conversation history
    if (agent.conversations && agent.conversations.length > 0) {
      const recentMessages = agent.conversations.slice(-4); // Last 4 messages
      recentMessages.forEach(msg => {
        chatContext.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    const response = await llmService.generateResponse(message, chatContext);

    return {
      role: 'agent',
      content: response,
      timestamp: new Date(),
      address: userAddress
    };
  }
}

module.exports = new AgentService();
