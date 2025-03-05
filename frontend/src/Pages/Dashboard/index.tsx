import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/Blocks/Navbar';
import { api } from '@/services/api';
import { TokenData } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Define the API response type
interface APITokenData {
  _id?: string;
  name?: string;
  symbol?: string;
  description?: string;
  agentType?: string;
  creatorAddress?: string;
  imageUrl?: string;
  networkType?: 'testnet' | 'mainnet';
  totalSupply?: string;
  decimals?: number;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  totalValueLocked?: number;
  holders?: number;
  tokenAddress?: string;
  inPool?: boolean;
  projectDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  poolAddress?: string;
  liquidityProgress?: number;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const response = await api.getTokens();
        console.log('Dashboard - Fetched tokens:', response);
        if (response.success && response.tokens) {
          // Process tokens to ensure all required fields
          const processedTokens = (response.tokens as APITokenData[]).map(token => ({
            _id: token._id || '',
            name: token.name || '',
            symbol: token.symbol || '',
            description: token.description || '',
            agentType: token.agentType || '',
            creatorAddress: token.creatorAddress || '',
            imageUrl: token.imageUrl || '',
            networkType: token.networkType || '',
            totalSupply: token.totalSupply || '0',
            decimals: token.decimals || 18,
            price: token.price || 0,
            priceChange24h: token.priceChange24h || 0,
            marketCap: token.marketCap || 0,
            volume24h: token.volume24h || 0,
            totalValueLocked: token.totalValueLocked || 0,
            holders: token.holders || 0,
            tokenAddress: token.tokenAddress || '',
            inPool: !!token.inPool,
            projectDescription: token.projectDescription || '',
            createdAt: token.createdAt || new Date().toISOString(),
            updatedAt: token.updatedAt || new Date().toISOString(),
            __v: token.__v || 0,
            poolAddress: token.poolAddress || '',
            liquidityProgress: token.liquidityProgress || 0
          })) as TokenData[];
          console.log('Dashboard - Processed tokens:', processedTokens);
          setTokens(processedTokens);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    // Fetch tokens every 30 seconds
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter tokens based on their status
  const recentlyLaunched = tokens.filter(token => 
    token.createdAt ? new Date(token.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 : false
  );

  const listedTokens = tokens; // Show all tokens in the Listed Tokens tab

  const inPoolTokens = tokens.filter(token => token.inPool === true);

  const renderTokenCard = (token: TokenData) => (
    <Card 
      key={token._id} 
      className="p-4 cursor-pointer bg-[#F5F7FA] border border-[#4A90E2] hover:bg-white hover:shadow-lg transition-all duration-300"
      onClick={() => navigate(`/token/${token._id}`)}
    >
      <div className="flex items-center space-x-4">
        <img 
          src={token.imageUrl || '/default-token.png'} 
          alt={token.name} 
          className="w-12 h-12 rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-token.png';
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#2C3E50]">{token.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[#2C3E50]">{token.symbol}</p>
            {token.inPool && (
              <span className="px-2 py-0.5 text-xs bg-[#4A90E2] text-white rounded-full">
                In Pool
              </span>
            )}
          </div>
          <p className="text-sm text-[#2C3E50] mt-1">{token.agentType}</p>
        </div>
        <div className="text-right">
          <p className="text-lg text-[#2C3E50]">{token.price !== undefined && token.price > 0 ? `$${token.price.toFixed(4)}` : '0.001'}<span className="text-blue-700"> TON</span></p>
          <p className="text-sm text-blue-700">
            {token.inPool ? `In Pool` : 'Ready To Buy'}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2C3E50]">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2C3E50]">Token Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/launch')} className="bg-[#4A90E2] text-white hover:bg-[#6BB9F0]">
              Create New AI Agent
            </Button>
            <Button onClick={() => navigate('/tokens')} className="bg-[#4A90E2] text-white hover:bg-[#6BB9F0] flex items-center gap-2">
              Tokens <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Custom Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-[#F5F7FA]">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'recent'
                ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                : 'text-[#2C3E50] hover:text-[#6BB9F0]'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recently Launched
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'listed'
                ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                : 'text-[#2C3E50] hover:text-[#6BB9F0]'
            }`}
            onClick={() => setActiveTab('listed')}
          >
            Listed Tokens
          </button>
        
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90E2] mx-auto"></div>
              <p className="mt-2 text-[#2C3E50]">Loading tokens...</p>
            </div>
          ) : (
            <>
              {activeTab === 'recent' && (
                <div className="space-y-4">
                  {recentlyLaunched.length > 0 ? (
                    recentlyLaunched.map(renderTokenCard)
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#2C3E50]">No recently launched tokens</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'listed' && (
                <div className="space-y-4">
                  {listedTokens.length > 0 ? (
                    listedTokens.map(renderTokenCard)
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#2C3E50]">No tokens listed yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pool' && (
                <div className="space-y-4">
                  {inPoolTokens.length > 0 ? (
                    inPoolTokens.map(renderTokenCard)
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#2C3E50]">No tokens in pool</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
