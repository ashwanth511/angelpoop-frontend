import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address, toNano, fromNano } from '@ton/core';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from '@ton/ton';
import { PoolCore } from '@/wrappers/tact_PoolCore';
import TonConnectSender from '@/hooks/TonConnectSender';
import { api } from '../../services/api';
import type { TokenData } from '@/types/types';
import { LiquidityModal } from './LiquidityModal';
import { Copy } from 'lucide-react';

interface APITokenData {
  _id?: string;
  name?: string;
  symbol?: string;
  description?: string;
  agentType?: string;
  creatorAddress?: string;
  imageUrl?: string;
  networkType?: string;
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
  website?: string;
  telegram?: string;
  twitter?: string;
  initialLiquidity?: string;
}

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background:#ffffff;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;






export const TokenList: React.FC = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [isLiquidityModalOpen, setIsLiquidityModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();

  const getNonBounceableAddress = (address: string, isTestnet: boolean): string => {
    try {
      let addr;
      if (address.match(/^(EQ|UQ|kQ|0Q)/)) {
        const parsed = Address.parseFriendly(address);
        addr = parsed.address;
      } else {
        addr = Address.parse(address);
      }
      return addr.toString({
        testOnly: isTestnet,
        bounceable: false,
        urlSafe: true
      });
    } catch (error) {
      console.error('Address conversion error:', error);
      return address;
    }
  };

  const checkTokenInPool = async (tokenAddress: string, networkType: string) => {
    try {
      const endpoint = await getHttpEndpoint({
        network: networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      const poolCore = PoolCore.fromAddress(poolCoreAddress);
      const contract = client.open(poolCore);

      const parsedTokenAddress = Address.parse(tokenAddress);
      const isInPool = await contract.getHasPool(parsedTokenAddress);
      
      console.log('TokenList - Check pool status:', {
        tokenAddress,
        networkType,
        isInPool
      });
      
      return isInPool;
    } catch (error) {
      console.error('Error checking token in pool:', error);
      return false;
    }
  };

  const syncTokenPoolStatus = async (token: TokenData) => {
    try {
      if (!token.tokenAddress) return false;
      
      // Check actual status from contract
      const contractPoolStatus = await checkTokenInPool(token.tokenAddress, token.networkType);
      
      // If there's a mismatch between contract and database status
      if (contractPoolStatus !== token.inPool) {
        // Update database to match contract status
        await api.updateToken({
          id: token._id,
          inPool: contractPoolStatus,
          poolAddress: contractPoolStatus ? "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF" : undefined
        });
        
        // Update local state
        token.inPool = contractPoolStatus;
      }
      
      return token.inPool;
    } catch (error) {
      console.error('Error syncing token pool status:', error);
      return token.inPool || false;
    }
  };

  const getTokenLiquidity = async (token: TokenData) => {
    try {
      if (!token.tokenAddress || !token.inPool) return 0;
      
      const endpoint = await getHttpEndpoint({
        network: token.networkType === 'testnet' ? "testnet" : "mainnet"
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      const poolCore = PoolCore.fromAddress(poolCoreAddress);
      const contract = client.open(poolCore);

      const tokenAddress = Address.parse(token.tokenAddress);
      const liquidity = await contract.getGetJettonLiquidity(tokenAddress);
      
      return Number(fromNano(liquidity));
    } catch (error) {
      console.error('Error getting token liquidity:', error);
      return 0;
    }
  };

  const renderTokenActions = (token: TokenData) => {
    if (!tonConnectUI.account?.address) return null;

    // Convert both addresses to non-bounceable format for comparison
    const userAddress = getNonBounceableAddress(tonConnectUI.account.address, token.networkType === 'testnet');
    const creatorAddress = token.creatorAddress;

    console.log('User Address:', userAddress);
    console.log('Creator Address:', creatorAddress);
    
    // Only show actions if user is token creator
    if (userAddress !== creatorAddress) {
      return null;
    }

    if (token.inPool) {
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedToken(token);
            setIsLiquidityModalOpen(true);
          }}
          disabled={loading}
          className="bg-[#00FFA3] text-black hover:bg-[#00DD8C] px-4 py-2 rounded-lg"
        >
          Add Liquidity
        </Button>
      );
    }

    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleAddToPool(token);
        }}
        disabled={loading}
        className="bg-[#00FFA3] text-black hover:bg-[#00DD8C] px-4 py-2 rounded-lg"
      >
        {loading ? 'Adding to Pool...' : 'Add to Pool'}
      </Button>
    );
  };

  const renderTokenCard = (token: TokenData) => (
    <Card 
      key={token._id} 
      className="!bg-gradient-to-r max-w-full max-h-full !from-blue-500 !to-blue-200 p-4 cursor-pointer hover:from-blue-600 hover:to-blue-300 transition-all duration-300 shadow-lg border border-black"
      onClick={() => navigate(`/token/${token._id}`)}
    >
      <div className="flex items-center justify-between space-x-4 mb-3">
        <img src={token.imageUrl} alt={token.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black">{token.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-black">{token.symbol}</p>
            {token.inPool && (
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-800 rounded-full">
                In Pool
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg">${token.price?.toFixed(4) || '0.00'}</p>
          <p className="text-sm text-black">
            {token.inPool ? `Liquidity: ${token.liquidityProgress?.toFixed(1) || '0'}%` : 'Not in Pool'}
          </p>
        </div>
      </div>

      {/* Bonding Curve Progress */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-black">Bonding Curve Progress</span>
          <span className="text-black font-medium">{token.liquidityProgress?.toFixed(1) || '0'}%</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00FFA3] to-[#00DD8C] transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(100, token.liquidityProgress || 0)}%`,
              boxShadow: token.liquidityProgress > 0 ? '0 0 20px rgba(0, 255, 163, 0.3)' : 'none'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-black">
          <span>0 TON</span>
          <span>10,000 TON</span>
        </div>
      </div>

      {/* Token Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-black">Creator:</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-black truncate">{shortenAddress(token.creatorAddress)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(token.creatorAddress);
                toast.success('Address copied!');
              }}
              className="text-black hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <span className="text-black">Token Address:</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-black truncate">{shortenAddress(token.tokenAddress || '')}</span>
            {token.tokenAddress && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(token.tokenAddress || '');
                  toast.success('Address copied!');
                }}
                className="text-black hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end">
        {renderTokenActions(token)}
      </div>
    </Card>
  );


  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAddLiquidity = async (amount: string) => {
    if (!selectedToken || !tonConnectUI.connected) return;

    setLoading(true);
    try {
      const sender = new TonConnectSender(tonConnectUI.connector);
      const endpoint = await getHttpEndpoint({
        network: selectedToken.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      
      let tokenAddress: Address;

      try {
        if (selectedToken.tokenAddress?.match(/^(EQ|UQ|kQ|0Q)/)) {
          const parsed = Address.parseFriendly(selectedToken.tokenAddress);
          tokenAddress = parsed.address;
        } else {
          tokenAddress = Address.parse(selectedToken.tokenAddress || '');
        }
      } catch (error) {
        console.error('Error parsing addresses:', error);
        toast.error('Invalid addresses');
        return;
      }

      const poolCore = PoolCore.fromAddress(poolCoreAddress);
      const contract = client.open(poolCore);

      // Send transaction
      await contract.send(
        sender,
        {
          value: toNano(amount),
          bounce: false
        },
        {
          $$type: 'AddJetton',
          jettonAddress: tokenAddress
        }
      );

      toast.success('Liquidity added successfully!');

      // Update token liquidity after adding
      const newLiquidity = await getTokenLiquidity(selectedToken);
      
      // Update the token in the list
      setTokens(prevTokens => 
        prevTokens.map(t => 
          t._id === selectedToken._id 
            ? { ...t, liquidityProgress: newLiquidity }
            : t
        )
      );

    } catch (error) {
      console.error('Error adding liquidity:', error);
      toast.error('Failed to add liquidity');
    } finally {
      setLoading(false);
      setIsLiquidityModalOpen(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 30000; // 30 seconds

    const loadTokens = async (forceRefresh = false) => {
      const now = Date.now();
      if (!forceRefresh && now - lastUpdateTime < UPDATE_INTERVAL) {
        return; // Skip if not enough time has passed
      }

      try {
        const response = await api.getTokens();
        if (!isMounted) return;

        if (!response?.success || !response?.tokens) {
          console.error('Invalid API response:', response);
          return;
        }

        // First update with basic token data
        if (!tokens.length) {
          setTokens(response.tokens.map((token: APITokenData) => ({
            _id: token._id || '',
            name: token.name || '',
            symbol: token.symbol || '',
            description: token.description || '',
            agentType: token.agentType || '',
            creatorAddress: token.creatorAddress || '',
            imageUrl: token.imageUrl || '',
            networkType: (token.networkType || 'testnet') as "testnet" | "mainnet",
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
          })));
        }

        // Then update pool status and liquidity in background
        const updatedTokens = await Promise.all(
          response.tokens.map(async (rawToken: APITokenData) => {
            // First create a properly typed TokenData object
            const token: TokenData = {
              _id: rawToken._id || '',
              name: rawToken.name || '',
              symbol: rawToken.symbol || '',
              description: rawToken.description || '',
              agentType: rawToken.agentType || '',
              creatorAddress: rawToken.creatorAddress || '',
              imageUrl: rawToken.imageUrl || '',
              networkType: (rawToken.networkType || 'testnet') as "testnet" | "mainnet",
              totalSupply: rawToken.totalSupply || '0',
              decimals: rawToken.decimals || 18,
              price: rawToken.price || 0,
              priceChange24h: rawToken.priceChange24h || 0,
              marketCap: rawToken.marketCap || 0,
              volume24h: rawToken.volume24h || 0,
              totalValueLocked: rawToken.totalValueLocked || 0,
              holders: rawToken.holders || 0,
              tokenAddress: rawToken.tokenAddress || '',
              inPool: rawToken.inPool || false,
              projectDescription: rawToken.projectDescription || '',
              createdAt: rawToken.createdAt || new Date().toISOString(),
              updatedAt: rawToken.updatedAt || new Date().toISOString(),
              __v: rawToken.__v || 0,
              poolAddress: rawToken.poolAddress || '',
              liquidityProgress: rawToken.liquidityProgress || 0
            };
            
            const inPool = await syncTokenPoolStatus(token);
            const liquidity = inPool ? await getTokenLiquidity(token) : 0;
            return {
              ...token,
              liquidityProgress: liquidity
            };
          })
        );

        if (isMounted) {
          setTokens(updatedTokens);
          lastUpdateTime = now;
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial load
    loadTokens(true);

    // Set up interval for background updates
    const intervalId = setInterval(() => {
      loadTokens(false);
    }, UPDATE_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Loading skeleton
  if (isLoading && !tokens.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Tokens</h1>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-10 bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-700 rounded w-1/4 animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse" />
                  </div>
                </div>
                <div className="h-3 bg-gray-700 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleAddToPool = async (token: TokenData) => {
    if (!tonConnectUI.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!token.tokenAddress) {
      toast.error('Token address not found');
      return;
    }

    setLoading(true);
    try {
      // First check if token is already in pool
      const isInPool = await checkTokenInPool(token.tokenAddress, token.networkType);
      if (isInPool) {
        toast.error('Token is already in pool. Please add liquidity instead.');
        return;
      }

      const sender = new TonConnectSender(tonConnectUI.connector);
      const endpoint = await getHttpEndpoint({
        network: token.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      const poolCore = PoolCore.fromAddress(poolCoreAddress);
      const contract = client.open(poolCore);

      let tokenAddress: Address;

      try {
        if (token.tokenAddress.match(/^(EQ|UQ|kQ|0Q)/)) {
          const parsed = Address.parseFriendly(token.tokenAddress);
          tokenAddress = parsed.address;
        } else {
          tokenAddress = Address.parse(token.tokenAddress);
        }
      } catch (error) {
        console.error('Error parsing addresses:', error);
        toast.error('Invalid addresses');
        return;
      }

      // Send transaction
      await contract.send(
        sender,
        {
          value: toNano('0.5'),
          bounce: false
        },
        {
          $$type: 'AddJetton',
          jettonAddress: tokenAddress
        }
      );

      toast.success('Token added to pool successfully!');

      // Update token in database
      await api.updateToken({
        id: token._id!,
        inPool: true,
        poolAddress: "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF"
      });

      // Reload tokens to get fresh data
      const response = await api.getTokens();
      if (response.success && response.tokens) {
        const tokensWithStatus = await Promise.all(
          response.tokens.map(async (rawToken: APITokenData) => {
            // First create a properly typed TokenData object
            const token: TokenData = {
              _id: rawToken._id || '',
              name: rawToken.name || '',
              symbol: rawToken.symbol || '',
              description: rawToken.description || '',
              agentType: rawToken.agentType || '',
              creatorAddress: rawToken.creatorAddress || '',
              imageUrl: rawToken.imageUrl || '',
              networkType: (rawToken.networkType || 'testnet') as "testnet" | "mainnet",
              totalSupply: rawToken.totalSupply || '0',
              decimals: rawToken.decimals || 18,
              price: rawToken.price || 0,
              priceChange24h: rawToken.priceChange24h || 0,
              marketCap: rawToken.marketCap || 0,
              volume24h: rawToken.volume24h || 0,
              totalValueLocked: rawToken.totalValueLocked || 0,
              holders: rawToken.holders || 0,
              tokenAddress: rawToken.tokenAddress || '',
              inPool: rawToken.inPool || false,
              projectDescription: rawToken.projectDescription || '',
              createdAt: rawToken.createdAt || new Date().toISOString(),
              updatedAt: rawToken.updatedAt || new Date().toISOString(),
              __v: rawToken.__v || 0,
              poolAddress: rawToken.poolAddress || '',
              liquidityProgress: 0
            };
            
            const inPool = await syncTokenPoolStatus(token);
            const liquidity = inPool ? await getTokenLiquidity(token) : 0;
            return {
              ...token,
              liquidityProgress: liquidity
            };
          })
        );

        setTokens(tokensWithStatus);
      }
    } catch (error: any) {
      console.error('Error details:', error);
      toast.error('Failed to add token to pool');
    } finally {
      setLoading(false);
    }
  };


  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.agentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
      <Header>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-black"
        >
          <ArrowLeft className="mr-2 h-4 w-4 " /> Back
        </Button>

        <h1 className='text-black text-4xl font-bold'>Token List</h1>
        <p className="text-black  text-xl">View all launched tokens</p>

        <Button onClick={() => navigate('/launch')} className="bg-gradient-to-r from-blue-500 to-blue-200 text-black hover:bg-[#00DD8C]">
          Create New AI Agent
        </Button>

        <div className="w-full mt-4">
          <input
            type="text"
            placeholder="Search tokens by name, description, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-700 focus:outline-none focus:border-[#00FFA3] text-white"
          />
        </div>
      </Header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00FFA3]"></div>
        </div>
      ) : (
        <Grid>
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black mb-4">No tokens found</p>
              <Button onClick={() => navigate('/launch')} className="bg-[#00FFA3] text-black hover:bg-[#00DD8C]">
                Launch Your First Token
              </Button>
            </div>
          ) : (
            filteredTokens.map((token) => (
              renderTokenCard(token)
            ))
          )}
        </Grid>
      )}
      <LiquidityModal
        isOpen={isLiquidityModalOpen}
        onClose={() => {
          setIsLiquidityModalOpen(false);
          setSelectedToken(null);
        }}
        onConfirm={handleAddLiquidity}
        tokenName={selectedToken?.name || ''}
      />
    </div>
    </div>
  );
};
