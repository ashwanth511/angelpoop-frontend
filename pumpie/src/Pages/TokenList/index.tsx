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
import type { TokenData } from '../../services/api';
import { LiquidityModal } from './LiquidityModal';
import { Copy } from 'lucide-react';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

const TokenImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const TokenSymbol = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const TokenType = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const TokenDescription = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const TokenMetrics = styled.div`
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricLabel = styled.span`
  font-weight: 500;
`;

const MetricValue = styled.span`
  font-weight: 600;
`;

interface Token extends TokenData {
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  holders?: number;
  liquidityProgress?: number;
}

const formatNumber = (num: number, decimals: number = 2): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
};

const formatCurrency = (amount: number, currency: 'TON' | 'USD' = 'TON'): string => {
  const tonPrice = 2.5; // Default TON price in USD
  if (currency === 'USD') return `$${formatNumber(amount * tonPrice)}`;
  return `${formatNumber(amount)} TON`;
};

export const TokenList: React.FC = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tonConnectUI] = useTonConnectUI();
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [isLiquidityModalOpen, setIsLiquidityModalOpen] = useState(false);

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
      const poolCore = new PoolCore(poolCoreAddress);
      const contract = client.open(poolCore);

      const parsedTokenAddress = Address.parse(tokenAddress);
      const isInPool = await contract.getHasPool(parsedTokenAddress);
      return isInPool;
    } catch (error) {
      console.error('Error checking token in pool:', error);
      return false;
    }
  };

  const syncTokenPoolStatus = async (token: TokenData) => {
    try {
      if (!token.tokenAddress) return false;
      
      const contractPoolStatus = await checkTokenInPool(token.tokenAddress, token.networkType);
      
      // If there's a mismatch between contract and database status
      if (contractPoolStatus !== token.inPool) {
        console.log('Syncing pool status for token:', token.name);
        console.log('Contract status:', contractPoolStatus);
        console.log('Database status:', token.inPool);
        
        try {
          // Update database to match contract status
          await api.updateToken({
            id: token._id,
            inPool: contractPoolStatus,
            poolAddress: contractPoolStatus ? "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF" : undefined
          });
          
          // Update local state
          token.inPool = contractPoolStatus;

          // If token is in pool, get liquidity
          if (contractPoolStatus) {
            const endpoint = await getHttpEndpoint({
              network: token.networkType === 'testnet' ? "testnet" : "mainnet"
            });

            const client = new TonClient({ endpoint });
            const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
            const poolCore = new PoolCore(poolCoreAddress);
            const contract = client.open(poolCore);

            const tokenAddress = Address.parse(token.tokenAddress);
            const liquidity = await contract.getGetJettonLiquidity(tokenAddress);
            
            // Update liquidity progress
            const liquidityAmount = Number(fromNano(liquidity));
            token.liquidityProgress = liquidityAmount;
          }
        } catch (error) {
          console.error('Failed to update token in database:', error);
        }
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
      const poolCore = new PoolCore(poolCoreAddress);
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
      className="p-4 hover:bg-gray-800 transition-colors"
      onClick={() => handleTokenClick(token)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <img src={token.imageUrl} alt={token.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{token.name}</h3>
          <p className="text-sm text-gray-400">{token.symbol}</p>
        </div>
        <div className="text-right">
          <div className="flex flex-col">
            <span className="text-lg font-medium">{formatCurrency(token.liquidityProgress || 0)}</span>
            <span className="text-sm text-gray-400">{formatCurrency(token.liquidityProgress || 0, 'USD')}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {token.inPool ? (
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                In Pool
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs bg-gray-500/20 text-gray-400 rounded-full">
                Not in Pool
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <span>Creator:</span>
          <div className="flex items-center gap-2">
            <span className="text-white">{shortenAddress(token.creatorAddress)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(token.creatorAddress);
              }}
              className="hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Token Address:</span>
          <div className="flex items-center gap-2">
            <span className="text-white">{shortenAddress(token.tokenAddress || '')}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(token.tokenAddress || '');
              }}
              className="hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {token.inPool && (
          <div className="flex justify-between items-center">
            <span>Liquidity:</span>
            <span className="text-white">{token.liquidityProgress?.toFixed(1) || '0'} TON</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        {renderTokenActions(token)}
      </div>
    </Card>
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

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

      const poolCore = new PoolCore(poolCoreAddress);
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
    const loadTokens = async () => {
      setIsLoading(true);
      try {
        const response = await api.getTokens();
        if (!response.success || !response.tokens) {
          toast.error('Failed to load tokens');
          return;
        }

        const tokensWithStatus = await Promise.all(
          response.tokens.map(async (token) => {
            const inPool = await syncTokenPoolStatus(token);
            const liquidity = inPool ? await getTokenLiquidity(token) : 0;
            return { ...token, liquidityProgress: liquidity };
          })
        );
        setTokens(tokensWithStatus);
      } catch (error) {
        console.error('Error loading tokens:', error);
        toast.error('Failed to load tokens');
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();

    // Set up periodic updates for tokens in pool
    const interval = setInterval(async () => {
      setTokens(prevTokens => {
        const updatedTokens = [...prevTokens];
        prevTokens.forEach(async (token, index) => {
          if (token.inPool) {
            const liquidity = await getTokenLiquidity(token);
            updatedTokens[index] = { ...token, liquidityProgress: liquidity };
          }
        });
        return updatedTokens;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTokenClick = (token: any) => {
    console.log('Navigating to token:', token);
    const tokenId = token.id || token._id;
    navigate(`/token/${tokenId}`);
  };

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
      const poolCore = new PoolCore(poolCoreAddress);
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
          response.tokens.map(async (token) => {
            const inPool = await syncTokenPoolStatus(token);
            const liquidity = inPool ? await getTokenLiquidity(token) : 0;
            return { ...token, liquidityProgress: liquidity };
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
    <Container>
      <Header>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Title>Token List</Title>
        <Subtitle>View all launched tokens</Subtitle>

        <Button onClick={() => navigate('/launch')} className="bg-[#00FFA3] text-black hover:bg-[#00DD8C]">
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
              <p className="text-white/80 mb-4">No tokens found</p>
              <Button onClick={() => navigate('/launch')}>
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
    </Container>
  );
};
