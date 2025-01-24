const { GoogleGenerativeAI } = require("@google/generative-ai");

class LLMService {
  constructor() {
    this.genAI = new GoogleGenerativeAI('AIzaSyDV4_PbIwChLKHfJ54YJ2EldjxCf8jcYKo');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateResponse(prompt, context) {
    try {
      const chat = this.model.startChat({
        history: context.map(msg => ({
          role: msg.role,
          parts: msg.content
        }))
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw AI response:', text);

      // Try to parse as JSON if the response looks like JSON
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        try {
          // Clean up any markdown formatting
          const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanJson);
        } catch (e) {
          console.log('Response is not valid JSON:', e);
          return text;
        }
      }
      
      return text;
    } catch (error) {
      console.error('LLM Service Error:', error);
      throw error;
    }
  }

  async generateAgentPersonality(tokenData) {
    const prompt = `
Create a personality profile for an AI agent representing a token with these details:
Token Name: ${tokenData.name}
Type: ${tokenData.agentType}
Description: ${tokenData.description}
Address: ${tokenData.tokenAddress}
Website: ${tokenData.website}
Telegram: ${tokenData.telegram}
Twitter: ${tokenData.twitter}


Return a JSON object with these fields:
{
  "traits": ["list", "of", "personality", "traits"],
  "style": "conversational style description",
  "expertise": ["area1", "area2", "area3"],
  "languages": ["English", "other languages"],
  "features": ["feature1", "feature2", "feature3"]
}

Do not include any explanations or text outside the JSON object.`;

    const personality = await this.generateResponse(prompt, []);
    return typeof personality === 'string' ? JSON.parse(personality) : personality;
  }

  async generateTokenContext(tokenData) {
    const prompt = `
Analyze this token and create key points for the AI agent:
Token Name: ${tokenData.name}
Type: ${tokenData.agentType}
Description: ${tokenData.description}
Address: ${tokenData.tokenAddress}
Website: ${tokenData.website}
Telegram: ${tokenData.telegram}
Twitter: ${tokenData.twitter}
Response must be a JSON array of exactly 5 strings covering:
1. Token purpose and utility
2. Target audience
3.Token address token symbol providing and all
3. Key features
4. Market positioning
5. Future potential

Example format:
[
  "Purpose: This token...",
  "Audience: Aimed at...",
  "Features: Offers...",
  "Market: Positioned as...",
  "Future: Has potential for..."
]

Do not include any explanations or text outside the JSON array.`;

    const context = await this.generateResponse(prompt, []);
    return typeof context === 'string' ? JSON.parse(context) : context;
  }

  async handleUserQuery(agent, query) {
    const prompt = `You are an AI agent for the token "${agent.name}". Respond to the user's query based on these details:

Personality: ${JSON.stringify(agent.personality)}
Context: ${JSON.stringify(agent.context)}
Query: ${query}

Keep your response concise and informative. Match your personality traits but focus on providing accurate information.`;

    return this.generateResponse(prompt, []);
  }
}

module.exports = new LLMService();
