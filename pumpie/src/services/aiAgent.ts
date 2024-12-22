import axios from 'axios';
import { TonClient } from '@ton/ton';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { agentTemplates } from '../config/agentTemplates';
import { BASE_URL } from '../config';
import { GOOGLE_AI_API_KEY } from '../config';
import { create } from 'zustand';

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AIAgentConfig {
  telegramBotToken?: string;
  twitterConfig?: {
    apiKey: string;
    apiKeySecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };
  projectDescription: string;
  tokenName: string;
  tokenSymbol: string;
  aiConfig: {
    handleAnnouncements: boolean;
    handleUserQueries: boolean;
    customInstructions: string;
  };
  platformType: 'telegram' | 'twitter' | 'both';
}

export interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  owner: string;
  description?: string;
  projectDescription?: string;
  agentType: 'entertainment' | 'utility' | 'social' | 'defi';
}

interface AgentData {
  tokenId: string;
  agentType: 'entertainment' | 'utility' | 'social' | 'defi';
  personality: any;
  context: string[];
  lastActive: Date;
}

// Agent store for global state
interface AgentState {
  agents: { [tokenId: string]: AIAgent };
  addAgent: (tokenId: string, agent: AIAgent) => void;
  getAgent: (tokenId: string) => AIAgent | undefined;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: {},
  addAgent: (tokenId, agent) => set(state => ({ agents: { ...state.agents, [tokenId]: agent } })),
  getAgent: (tokenId) => get().agents[tokenId]
}));

export class AIAgent {
  private tokenId: string;
  private tokenInfo: TokenInfo | null = null;
  private client: TonClient;
  private personality: any = null;
  private context: string[] = [];
  private model = model;
  private userLanguage: string = 'en';

  constructor(tokenId: string) {
    this.tokenId = tokenId;
    this.client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });
  }

  setUserLanguage(language: string) {
    this.userLanguage = language;
  }

  async initialize() {
    try {
      const tokenData = await this.fetchTokenInfo();
      this.tokenInfo = tokenData;
      this.personality = agentTemplates[tokenData.agentType];
      this.initializeContext();

      await this.storeAgentData({
        tokenId: this.tokenId,
        agentType: tokenData.agentType,
        personality: this.personality,
        context: this.context,
        lastActive: new Date()
      });

      // Add agent to global store
      useAgentStore.getState().addAgent(this.tokenId, this);
    } catch (error) {
      console.error('Error initializing AI agent:', error);
      throw new Error('Failed to initialize AI agent');
    }
  }

  private initializeContext() {
    const { personality } = this.personality;
    this.context = [
      `I am an AI agent for ${this.tokenInfo?.name}, a ${this.tokenInfo?.agentType} token.`,
      `My personality traits: ${personality.traits.join(', ')}`,
      `I communicate in a ${personality.communication_style} manner`,
      `My interests include: ${personality.interests.join(', ')}`,
      `Token Description: ${this.tokenInfo?.description}`,
      `I should detect and respond in the same language as the user's message.`
    ];
  }

  private async storeAgentData(agentData: AgentData): Promise<void> {
    try {
      const response = await axios.post(`${BASE_URL}/api/create-agent`, {
        tokenId: agentData.tokenId,
        agentType: agentData.agentType,
        personality: this.personality,
        context: this.context
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to store agent data');
      }
    } catch (error) {
      console.error('Error storing agent data:', error);
      throw new Error('Failed to store agent data');
    }
  }

  private async fetchTokenInfo(): Promise<TokenInfo> {
    try {
      const response = await axios.get(`${BASE_URL}/api/token/${this.tokenId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch token info');
      }
      return response.data.token;
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw new Error('Failed to fetch token info');
    }
  }

  async handleForumMessage(message: string): Promise<string> {
    try {
      const prompt = `
        Context:
        ${this.context.join('\n')}
        
        Important Instructions:
        1. Detect the language of the following user message
        2. Respond in the SAME language as the user's message
        3. Maintain the token's personality while responding
        4. Keep the response concise and natural
        
        User message: ${message}
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  static async loadFromDatabase(tokenId: string): Promise<AIAgent | null> {
    try {
      // Check if agent exists in store
      const existingAgent = useAgentStore.getState().getAgent(tokenId);
      if (existingAgent) {
        return existingAgent;
      }

      // Create new agent if not in store
      const agent = new AIAgent(tokenId);
      await agent.initialize();
      return agent;
    } catch (error) {
      console.error('Error loading agent from database:', error);
      throw error;
    }
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const prompt = this.formatPrompt(message);
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request at the moment.";
    }
  }

  private formatPrompt(message: string): string {
    return `
      Context: You are an AI agent for ${this.tokenInfo?.name}, a ${this.tokenInfo?.agentType} token.
      Personality: ${JSON.stringify(this.personality)}
      Previous Context: ${this.context.join('\n')}
      
      User Message: ${message}
      
      Please respond in a way that reflects your personality and knowledge about the token.
    `;
  }

  async handleForumMessage(message: string): Promise<string> {
    try {
      const response = await this.generateResponse(message);
      // Store the conversation in the database
      await this.storeConversation({
        tokenId: this.tokenId,
        message,
        response,
        timestamp: new Date()
      });
      return response;
    } catch (error) {
      console.error('Error handling forum message:', error);
      return "I apologize, but I'm having trouble responding at the moment.";
    }
  }

  private async storeConversation(conversationData: any) {
    try {
      await axios.post(`${BASE_URL}/api/conversations`, conversationData);
    } catch (error) {
      console.error('Error storing conversation:', error);
    }
  }

  async chat(message: string): Promise<string> {
    try {
      const response = await this.generateResponse(message);
      this.context.push(`User: ${message}`);
      this.context.push(`Assistant: ${response}`);
      
      if (this.context.length > 10) {
        this.context = this.context.slice(-10);
      }
      
      // Save updated context to database
      await this.storeAgentData({
        tokenId: this.tokenId,
        agentType: this.tokenInfo?.agentType || 'utility',
        personality: this.personality,
        context: this.context,
        lastActive: new Date()
      });
      
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      return this.personality.default_responses.error;
    }
  }

  async processMessage(message: string): Promise<string> {
    try {
      // Add user message to context
      this.context.push(`User: ${message}`);

      // Generate response based on context and token information
      const response = await this.generateResponse(message);

      // Add response to context
      this.context.push(`Assistant: ${response}`);

      // Keep only last 10 messages in context to avoid token limit
      if (this.context.length > 13) { // 3 system messages + 10 conversation messages
        this.context = [
          ...this.context.slice(0, 3), // Keep system messages
          ...this.context.slice(-10) // Keep last 10 conversation messages
        ];
      }

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return "I apologize, but I'm having trouble processing your message right now. Please try again later.";
    }
  }
}

export const createAIAgent = async (config: AIAgentConfig) => {
  try {
    // Create agent with initial data
    const agentData = {
      tokenId: config.tokenName.toLowerCase().replace(/\s+/g, '-'),
      agentType: config.aiConfig.handleUserQueries ? 'interactive' : 'announcement',
      personality: agentTemplates[config.aiConfig.handleUserQueries ? 'entertainment' : 'utility'],
      context: [
        `I am an AI agent for ${config.tokenName} (${config.tokenSymbol})`,
        `Project Description: ${config.projectDescription}`,
        `Token Description: ${config.description}`
      ],
      lastActive: new Date()
    };

    // Create agent using API
    const response = await axios.post(`${BASE_URL}/api/agents`, agentData);
    
    if (response.data && response.data.success) {
      return {
        id: agentData.tokenId,
        type: agentData.agentType,
        config: config
      };
    }
    
    throw new Error('Failed to create agent');
  } catch (error) {
    console.error('Error creating AI agent:', error);
    throw error;
  }
};

export async function chatWithAgent(tokenId: string, message: string): Promise<string> {
  try {
    let agent = activeAgents.get(tokenId);
    
    if (!agent) {
      agent = await AIAgent.loadFromDatabase(tokenId);
      if (!agent) {
        agent = new AIAgent(tokenId);
        await agent.initialize();
      }
      activeAgents.set(tokenId, agent);
    }
    
    return await agent.chat(message);
  } catch (error) {
    console.error('Error chatting with agent:', error);
    throw error;
  }
}
