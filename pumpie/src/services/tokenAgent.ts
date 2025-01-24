import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

interface TokenInfo {
  tokenName: string;
  tokenSymbol: string;
  description: string;
  agentType: 'entertainment' | 'onchain';
}

export class TokenAgent {
  private model: ChatOpenAI;
  private tokenInfo: TokenInfo;
  private messageHistory: BaseMessage[] = [];
  private systemPrompt: string;

  constructor(tokenInfo: TokenInfo, apiKey: string) {
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4-1106-preview',
      temperature: 0.7,
    });

    this.tokenInfo = tokenInfo;
    this.systemPrompt = this.createSystemPrompt();
  }

  private createSystemPrompt(): string {
    const basePrompt = `You are an AI agent for the ${this.tokenInfo.tokenName} (${this.tokenInfo.tokenSymbol}) token. 
    Token Description: ${this.tokenInfo.description}
    
    Your role is to ${this.tokenInfo.agentType === 'entertainment' 
      ? 'be entertaining, engaging, and create excitement around the token while maintaining the meme culture and community spirit.' 
      : 'provide technical insights, on-chain analysis, and professional guidance about the token\'s performance and metrics.'}
    
    Key Responsibilities:
    1. Answer questions about the token
    2. Provide relevant information based on your agent type
    3. Maintain consistent personality and knowledge
    4. Be helpful while staying within ethical boundaries
    
    Token Information to remember:
    - Name: ${this.tokenInfo.tokenName}
    - Symbol: ${this.tokenInfo.tokenSymbol}
    - Description: ${this.tokenInfo.description}
    
    Remember:
    - Never provide financial advice
    - Be honest about limitations
    - Stay in character as ${this.tokenInfo.agentType === 'entertainment' ? 'an entertaining meme-savvy agent' : 'a technical blockchain expert'}
    - Keep responses concise but informative
    - Reference token details when relevant`;

    return basePrompt;
  }

  public async chat(userMessage: string): Promise<string> {
    try {
      // Create messages array with system prompt and history
      const messages = [
        new SystemMessage(this.systemPrompt),
        ...this.messageHistory,
        new HumanMessage(userMessage)
      ];

      // Get AI response
      const response = await this.model.invoke(messages);

      // Update message history
      this.messageHistory.push(new HumanMessage(userMessage));
      this.messageHistory.push(response);

      // Keep history limited to last 10 messages to maintain context window
      if (this.messageHistory.length > 20) {
        this.messageHistory = this.messageHistory.slice(-20);
      }

      // Handle both string and complex message content
      if (typeof response.content === 'string') {
        return response.content;
      } else if (Array.isArray(response.content)) {
        // Join all text content from the array, handling different content types
        return response.content.map(item => {
          if (typeof item === 'string') return item;
          if ('type' in item && item.type === 'text') return item.text;
          return '';
        }).filter(Boolean).join(' ');
      }
      
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    } catch (error) {
      console.error('Error in agent chat:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }
}
