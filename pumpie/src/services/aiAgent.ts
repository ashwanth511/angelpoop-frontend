import axios from 'axios';
import { TonClient } from '@ton/ton';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { agentTemplates } from '../config/agentTemplates';
import { BASE_URL } from '../config';
import { GOOGLE_AI_API_KEY } from '../config';
import { api } from './api';
import { create } from 'zustand';

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Map to store active agents
const activeAgents = new Map<string, AIAgent>();

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
  description?: string;
  aiConfig: {
    handleAnnouncements: boolean;
    handleUserQueries: boolean;
    customInstructions: string;
    name: string;
    type: string;
    description: string;
  };
  platformType: 'telegram' | 'twitter' | 'both';
  tokenId?: string;
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
  networkType?: string;
}

interface AgentData {
  tokenId: string;
  name: string;
  agentType: string;
  description: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  initialLiquidity?: string; // Now optional
  tokenAddress?: string;
  personality: {
    handleUserQueries: boolean;
    customInstructions: string;
  };
  context?: string[];
  lastActive?: Date;
}


interface AgentTemplate {
  default_responses: {
    error: string;
    busy: string;
    greeting: string; // Add greeting property
  };
  // ... other template properties
}


// Agent store for global state
interface AgentState {
  agents: { [tokenId: string]: AIAgent };
  addAgent: (tokenId: string, agent: AIAgent) => void;
  getAgent: (tokenId: string) => AIAgent | undefined;
  createAgent: (agentData: AIAgentConfig) => Promise<{ success: boolean; message: string }>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: {},
  addAgent: (tokenId: string, agent: AIAgent) => set(state => ({ agents: { ...state.agents, [tokenId]: agent } })),
  getAgent: (tokenId: string) => get().agents[tokenId],

  createAgent: async (agentData: AIAgentConfig) => {
    try {
      // Convert AIAgentConfig to AgentData
      const agentDataForApi: AgentData = {
        tokenId: agentData.tokenId || '',
        name: agentData.tokenName,
        agentType: agentData.aiConfig.type,
        description: agentData.projectDescription,
        personality: {
          handleUserQueries: agentData.aiConfig.handleUserQueries,
          customInstructions: agentData.aiConfig.customInstructions
        }
      };

      const response = await api.createAgent(agentDataForApi);
      if (response.success) {
        return { success: true, message: 'Agent created successfully' };
      }
      return { success: false, message: 'Failed to create agent' };
    } catch (error) {
      console.error('Error creating agent:', error);
      return { success: false, message: 'Error creating agent' };
    }
  }
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
      // First try to load from database
      const response = await axios.get(`${BASE_URL}/api/agent/${this.tokenId}`);
      
      if (response.data.success && response.data.agent) {
        // If agent exists in database, use that data
        this.tokenInfo = response.data.agent.tokenInfo;
        this.personality = response.data.agent.personality;
        this.context = response.data.agent.context;
      } else {
        // If not in database, create new agent
        const tokenData = await this.fetchTokenInfo();
        this.tokenInfo = tokenData;
        
        // Initialize personality based on token type
        this.personality = agentTemplates[tokenData.agentType] || agentTemplates.utility;
        
        // Initialize context
        this.initializeContext();

        // Store agent data
        await this.storeAgentData({
          tokenId: this.tokenId,
          name: tokenData.name,
          agentType: tokenData.agentType,
          description: tokenData.description || '',
          personality: this.personality,
          context: this.context,
          lastActive: new Date()
        });
      }

      // Add agent to global store
      useAgentStore.getState().addAgent(this.tokenId, this);

      return this;
    } catch (error) {
      console.error('Error initializing AI agent:', error);
      throw new Error('Failed to initialize AI agent');
    }
  }

  private initializeContext() {
    if (!this.tokenInfo || !this.personality) return;

    const { personality } = this.personality;
    this.context = [
      `I am an AI agent for ${this.tokenInfo.name}, a ${this.tokenInfo.agentType} token.`,
      `My personality traits: ${personality.traits.join(', ')}`,
      `I communicate in a ${personality.communication_style} manner`,
      `My interests include: ${personality.interests.join(', ')}`,
      `Token Description: ${this.tokenInfo.description}`,
      `I should detect and respond in the same language as the user's message.`
    ];
  }

  private async storeAgentData(agentData: AgentData): Promise<void> {
    try {
      const response = await axios.post(`${BASE_URL}/api/create-agent`, {
        tokenId: agentData.tokenId,
        name: agentData.name,
        agentType: agentData.agentType,
        description: agentData.description,
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

  async generateResponse(message: string): Promise<string> {
    try {
      const prompt = this.formatPrompt(message);
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      let response = result.response.text();
      
      // Add type-specific signature
      const signature = this.getTypeSpecificSignature();
      if (signature) {
        response = `${response}\n\n${signature}`;
      }
      
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  private formatPrompt(message: string): string {
    const personality = this.personality?.personality || {};
    const traits = personality.traits || [];
    const style = personality.communication_style || 'professional';
    const functions = this.personality?.functions || [];

    // Get agent type specific instructions
    const typeSpecificInstructions = this.getTypeSpecificInstructions();

    return `You are an AI agent for ${this.tokenInfo?.name} (${this.tokenInfo?.symbol}), specifically designed as a ${this.tokenInfo?.agentType} token agent.

Key Token Information:
- Symbol: ${this.tokenInfo?.symbol}
- Description: ${this.tokenInfo?.description}
- Type: ${this.tokenInfo?.agentType}
- Supply: ${this.tokenInfo?.totalSupply}
- Network: ${this.tokenInfo?.networkType}

Your Role and Personality:
- You are a ${traits.join(', ')} AI agent
- You communicate in a ${style} manner
- Your key functions: ${functions.join(', ')}

${typeSpecificInstructions}

Instructions:
1. Give short, direct answers (2-3 sentences max)
2. Always stay in character as a ${this.tokenInfo?.agentType} token agent
3. Focus on your specific token type expertise
4. Include relevant metrics when asked
5. Be helpful but concise

User message: ${message}`;
  }

  private getTypeSpecificInstructions(): string {
    switch (this.tokenInfo?.agentType) {
      case 'entertainment':
        return `As an entertainment token agent:
- Focus on fun, engagement, and community aspects
- Share information about games, events, and entertainment features
- Keep responses upbeat and engaging`;

      case 'utility':
        return `As a utility token agent:
- Focus on technical features and practical use cases
- Explain utility functions and token mechanics
- Keep responses technical and precise`;

      case 'social':
        return `As a social token agent:
- Focus on community features and social interactions
- Highlight community benefits and engagement
- Keep responses friendly and community-oriented`;

      case 'defi':
        return `As a DeFi token agent:
- Focus on financial metrics and market performance
- Share insights about token economics and value
- Keep responses analytical and market-focused`;

      default:
        return '';
    }
  }

  private getTypeSpecificSignature(): string {
    const template = agentTemplates[this.tokenInfo?.agentType || 'utility'] as AgentTemplate;
    return template?.default_responses?.greeting || 'Hello! How can I assist you today?';
  }

  async handleForumMessage(message: string): Promise<string> {
    try {
      // Generate response
      const response = await this.generateResponse(message);
      
      // Update context
      this.context.push(`User: ${message}`);
      this.context.push(`Assistant: ${response}`);
      
      // Keep context manageable
      if (this.context.length > 10) {
        this.context = this.context.slice(-10);
      }

      try {
        // Store conversation
        await this.storeConversation({
          tokenId: this.tokenId,
          message: {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
          },
          response: {
            role: 'agent',
            content: response,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error storing conversation:', error);
        // Don't throw error here, just log it
      }
      
      // Update agent data
      try {
        await this.storeAgentData({
          tokenId: this.tokenId,
          name: this.tokenInfo?.name || '',
          agentType: this.tokenInfo?.agentType || 'utility',
          description: this.tokenInfo?.description || '',
          personality: this.personality,
          context: this.context,
          lastActive: new Date()
        });
      } catch (error) {
        console.error('Error updating agent data:', error);
        // Don't throw error here, just log it
      }
      
      return response;
    } catch (error) {
      console.error('Error handling forum message:', error);
      throw new Error('Failed to handle forum message');
    }
  }

  private async storeConversation(data: {
    tokenId: string;
    message: {
      role: string;
      content: string;
      timestamp: string;
    };
    response: {
      role: string;
      content: string;
      timestamp: string;
    };
  }) {
    try {
      const response = await axios.post(`${BASE_URL}/api/conversations`, data);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to store conversation');
      }
    } catch (error) {
      console.error('Error storing conversation:', error);
      throw error;
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
        name: this.tokenInfo?.name || '',
        agentType: this.tokenInfo?.agentType || 'utility',
        description: this.tokenInfo?.description || '',
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

  static async loadFromDatabase(tokenId: string): Promise<AIAgent> {
    try {
      // Create a new instance
      const agent = new AIAgent(tokenId);
      
      // Try to load from database
      const response = await axios.get(`${BASE_URL}/api/agent/${tokenId}`);
      
      if (response.data.success && response.data.agent) {
        // If agent exists in database, use that data
        agent.tokenInfo = response.data.agent.tokenInfo;
        agent.personality = response.data.agent.personality;
        agent.context = response.data.agent.context;
      } else {
        // If agent doesn't exist, initialize it
        await agent.initialize();
      }
      
      return agent;
    } catch (error) {
      console.error('Error loading agent from database:', error);
      throw new Error('Failed to load agent from database');
    }
  }
}

export const createAIAgent = async (config: AIAgentConfig) => {
  try {
    // Create agent with initial data
    const agentData: AgentData = {
      tokenId: config.tokenId || config.tokenName.toLowerCase().replace(/\s+/g, '-'),
      name: config.tokenName,
      agentType: config.aiConfig.type,
      description: config.projectDescription,
      personality: {
        handleUserQueries: config.aiConfig.handleUserQueries,
        customInstructions: config.aiConfig.customInstructions
      },
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
