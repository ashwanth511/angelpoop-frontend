import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

interface TokenData {
  liquidityProgress: number;
  volume24h: number;
  __v: number;
  updatedAt: string;
  createdAt: string;
  holders: number;
  totalValueLocked: number;
  marketCap: number;
  decimals: number;
  _id?: string;
  name: string;
  symbol: string;
  totalSupply: string;
  description: string;
  projectDescription?: string;
  agentType: string;
  creatorAddress: string;
  imageUrl?: string;
  networkType: 'testnet' | 'mainnet';
  price?: number;
  priceChange24h?: number;
  tokenAddress?: string;
  inPool?: boolean;
  poolAddress?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  initialLiquidity?: string;
}

interface AgentData {
  tokenId: string;
  name: string;
  agentType: string;
  description: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  initialLiquidity: string;
  tokenAddress: string;
  personality: {
    handleUserQueries: boolean;
    customInstructions: string;
  };
  context?: string[];
  lastActive?: Date;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  token?: T;
  tokens?: T[];
  agent?: T;
}

// Add this type
type CreateAgentPayload = Pick<AgentData, 'tokenId' | 'name' | 'agentType' | 'description' | 'personality'>;

// API service object
export const api = {
  // Generic HTTP methods
  async post(url: string, data?: any) {
    const response = await axios.post(`${API_BASE_URL}${url}`, data);
    return response.data;
  },

  async get(url: string) {
    const response = await axios.get(`${API_BASE_URL}${url}`);
    return response.data;
  },

  // Token APIs
  createToken: async (tokenData: TokenData) => {
    try {
      // Remove _id field if present to let MongoDB generate it
      const { _id, ...tokenDataWithoutId } = tokenData;
      console.log('API: Creating token with data:', tokenDataWithoutId);
      const response = await axios.post<ApiResponse<TokenData>>(`${API_BASE_URL}/create-token`, tokenDataWithoutId);
      console.log('API: Create token response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error creating token:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to create token');
    }
  },

  // Agent APIs
  createAgent: async (agentData: AgentData) => {
    try {
      console.log('API: Creating agent with data:', agentData);
      const response = await axios.post<ApiResponse<AgentData>>(`${API_BASE_URL}/create-agent`, agentData);
      console.log('API: Create agent response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error creating agent:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to create agent');
    }
  },

  // Get agent by token ID
  getAgent: async (tokenId: string) => {
    try {
      console.log('API: Fetching agent for token:', tokenId);
      const response = await axios.get<ApiResponse<AgentData>>(`${API_BASE_URL}/agent/${tokenId}`);
      console.log('API: Get agent response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching agent:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to fetch agent');
    }
  },

  storeChat: async (tokenId: string, message: any) => {
    try {
      console.log('API: Storing chat for token:', tokenId);
      const response = await axios.post<ApiResponse<any>>(`${API_BASE_URL}/agent/${tokenId}/chat`, message);
      console.log('API: Store chat response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error storing chat:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to store chat');
    }
  },

  storeConversation: async (tokenId: string, conversation: any) => {
    try {
      console.log('API: Storing conversation for token:', tokenId);
      const response = await axios.post<ApiResponse<any>>(`${API_BASE_URL}/agents/${tokenId}/conversations`, conversation);
      console.log('API: Store conversation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error storing conversation:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to store conversation');
    }
  },

  // Get all tokens
  getTokens: async () => {
    try {
      console.log('API: Fetching all tokens');
      const response = await axios.get<ApiResponse<TokenData>>(`${API_BASE_URL}/tokens`);
      console.log('API: Get tokens response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching tokens:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tokens');
    }
  },

  // Get token by ID
  getToken: async (id: string) => {
    try {
      console.log('API: Fetching token by ID:', id);
      const response = await axios.get<ApiResponse<TokenData>>(`${API_BASE_URL}/token/${id}`);
      console.log('API: Get token response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching token:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to fetch token');
    }
  },

  updateTokenAddress: async (id: string, address: string) => {
    try {
      console.log('API: Updating token address:', { id, address });
      const response = await axios.patch<ApiResponse<TokenData>>(`${API_BASE_URL}/tokens/${id}/address`, { address });
      console.log('API: Update token address response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error updating token address:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to update token address');
    }
  },

  updateToken: async (data: { id: string } & Partial<TokenData>) => {
    try {
      console.log('API: Updating token:', data);
      // If updating pool status, use the dedicated endpoint
      if ('inPool' in data) {
        const response = await axios.patch<ApiResponse<TokenData>>(`${API_BASE_URL}/token/${data.id}/pool`, {
          inPool: data.inPool,
          poolAddress: data.poolAddress
        });
        console.log('API: Update token pool status response:', response.data);
        return response.data;
      }
      // For other updates, use the general update endpoint
      const response = await axios.patch<ApiResponse<TokenData>>(`${API_BASE_URL}/token/${data.id}`, data);
      console.log('API: Update token response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error updating token:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to update token');
    }
  }
};

export default api;
