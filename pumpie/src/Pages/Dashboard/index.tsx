import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/Blocks/Navbar';
import { api } from '../../services/api';
import { TokenData } from '../../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await api.getTokens();
        if (response.success) {
          setTokens(response.tokens);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Filter tokens based on their status
  const recentlyLaunched = tokens.filter(token => 
    // Show all tokens launched in last 7 days
    Date.now() - new Date(token.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 // 7 days
  );

  const listedTokens = tokens.filter(token => 
    // Show all tokens that are ready for DEX
    token.liquidityProgress >= 100
  );

  const inPoolTokens = tokens.filter(token => 
    // Show all tokens that are in pool but not yet DEX ready
    token.inPool === true && token.liquidityProgress < 100
  );

  const renderTokenCard = (token: TokenData) => (
    <Card 
      key={token._id} 
      className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
      onClick={() => navigate(`/token/${token._id}`)}
    >
      <div className="flex items-center space-x-4">
        <img src={token.imageUrl} alt={token.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{token.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">{token.symbol}</p>
            {token.inPool && (
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                In Pool
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg">${token.price?.toFixed(4) || '0.00'}</p>
          <p className="text-sm text-gray-400">
            {token.inPool ? `Liquidity: ${token.liquidityProgress?.toFixed(1) || '0'}%` : 'Not in Pool'}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Token Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/launch')} className="bg-[#00FFA3] text-black hover:bg-[#00DD8C]">
              Create New AI Agent
            </Button>
            <Button onClick={() => navigate('/tokens')} className="bg-[#00FFA3] text-black hover:bg-[#00DD8C] flex items-center gap-2">
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
