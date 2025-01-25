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
      className="p-4 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-200 hover:bg-gray-800 transition-colors"
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
          <h3 className="text-lg font-semibold">{token.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-black">{token.symbol}</p>
            {token.inPool && (
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                In Pool
              </span>
            )}
          </div>
          <p className="text-sm text-black mt-1">{token.agentType}</p>
        </div>
        <div className="text-right">
          <p className="text-lg">{token.price !== undefined && token.price > 0 ? `$${token.price.toFixed(4)}` : 'N/A'}</p>
          <p className="text-sm text-black">
            {token.inPool ? `In Pool` : 'Not in Pool'}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white  text-black">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Token Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/launch')} className=" text-black bg-gradient-to-r from-blue-500 to-blue-200 hover:bg-[#4364f8]">
              Create New AI Agent
            </Button>
            <Button onClick={() => navigate('/tokens')} className=" text-black  bg-gradient-to-r from-blue-500 to-blue-200 hover:bg-[#4364f8] flex items-center gap-2">
              Tokens <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Custom Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-800">

          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'recent'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recently Launched
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'listed'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('listed')}
          >
            Listed Tokens
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'pool'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('pool')}
          >
            In Pool
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading tokens...</p>
            </div>
          ) : (
            <>
              {activeTab === 'recent' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Recently Launched Tokens</h2>
                  {recentlyLaunched.length > 0 ? (
                    recentlyLaunched.map(renderTokenCard)
                  ) : (
                    <p className="text-gray-400">No recently launched tokens</p>
                  )}
                </div>
              )}

              {activeTab === 'listed' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Listed Tokens (DEX Ready)</h2>
                  {listedTokens.length > 0 ? (
                    listedTokens.map(renderTokenCard)
                  ) : (
                    <p className="text-gray-400">No listed tokens</p>
                  )}
                </div>
              )}

              {activeTab === 'pool' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Tokens in Pool</h2>
                  {inPoolTokens.length > 0 ? (
                    inPoolTokens.map(renderTokenCard)
                  ) : (
                    <p className="text-gray-400">No tokens in pool</p>
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
