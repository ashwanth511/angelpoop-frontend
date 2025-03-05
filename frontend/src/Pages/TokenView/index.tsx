import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { api } from '../../services/api';
import { createChart, UTCTimestamp } from 'lightweight-charts';
import { ArrowLeft } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { AIAgent } from '@/services/aiAgent';
import { getTonClient } from '../../services/ton-client';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { Address ,toNano,fromNano} from '@ton/core';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from '@ton/ton';
import { PoolCore } from '@/wrappers/tact_PoolCore';
import TonConnectSender from '@/hooks/TonConnectSender';
import { JettonWalletImp } from '@/wrappers/tact_JettonWalletImp';
import { JettonFactory } from '@/wrappers/tact_JettonFactory';
import { JettonMasterTemplate } from '@/wrappers/tact_JettonMasterTemplate';
import { JettonWalletTemplate } from '@/wrappers/tact_JettonWalletTemplate';

interface Token {
  id: string;
  _id: string;
  name: string;
  description: string;
  agentType: string;
  creatorAddress: string;
  imageUrl?: string;
  networkType: string;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  totalValueLocked?: number;
  holders?: number;
  symbol?: string;
  poolAddress?: string;
  tokenAddress?: string;
  inPool?: boolean;
  liquidityProgress?: number;
  totalSupply?: bigint;
}

interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp?: string;
  address?: string;
}

export const TokenView = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState<'15m' | '1h' | '4h' | '1d'>('1h');
  const [fromAmount, setFromAmount] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<'summary' | 'developer' | 'registry'>('summary');
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [tonConnectUI] = useTonConnectUI();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [message, setMessage] = useState<string>(''); // State for the input message
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgentLoading, setIsAgentLoading] = useState(true);
  const [agentError, setAgentError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [tokenSupply, setTokenSupply] = useState<string | null>(null);
  const [liquidityProgress, setLiquidityProgress] = useState<number>(0);
  const [tonPrice, setTonPrice] = useState<number>(2.5); // Default TON price in USD
  const [tonBalance, setTonBalance] = useState<string>('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  // Target liquidity amount to move to DEX (10,000 TON)
  const TARGET_LIQUIDITY = toNano('10000');
  const DEX_URL = token?.networkType === 'testnet' ? 
    'https://app.dedust.io/swap/testnet' :  // DeDust testnet
    'https://app.ston.fi/swap';             // Stonfi mainnet

  // Add this state for tracking pool status
  const [isInPool, setIsInPool] = useState<boolean>(false);

  // Add these states for Twitter connection
  const [isCreator, setIsCreator] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);

  // Add this constant at the top
  const TOKEN_PRICE = 0.001; // Price in TON

  // Add this constant
  const TRANSACTION_FEE = 0.6; // 0.6 TON transaction fee

  const calculatePrice = (supply: bigint, amount: bigint): number => {
    // Get initial price from token or default to 0
    const initialPrice = token?.price || 0;
    
    // Convert supply to TON units
    const supplyInTon = Number(fromNano(supply));
 
    // This means each TON of liquidity adds 0.1 TON to the price
    const priceIncrease = supplyInTon * 0.1;
    const finalPrice = initialPrice + priceIncrease;
    
    return finalPrice;
  };

  const getTokenPrice = async () => {
    if (!token?.tokenAddress || !token.inPool) return;

    try {
      const endpoint = await getHttpEndpoint({
        network: token.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      const poolCore =  PoolCore.fromAddress(poolCoreAddress);
      const contract = client.open(poolCore);

      const tokenAddress = Address.parse(token.tokenAddress);
      const liquidity = await contract.getGetJettonLiquidity(tokenAddress);
      
      // Calculate price based on current liquidity
      const price = calculatePrice(liquidity, toNano('1'));
      setCurrentPrice(price);
      
      // Update token supply
      setTokenSupply(liquidity.toString());
      
      // Calculate progress towards DEX migration
      const liquidityInTon = Number(fromNano(liquidity));
      const progress = (liquidityInTon / 10000) * 100; // 10,000 TON target
      setLiquidityProgress(progress);

    } catch (error) {
      console.error('Error getting token price:', error);
    }
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const formatCurrency = (amount: number, currency: 'TON' | 'USD' = 'TON'): string => {
    if (currency === 'USD') return `$${formatNumber(amount)}`;
    return `${formatNumber(amount)} TON`;
  };

  const fetchTonBalance = async (address: string) => {
    try {
      const baseUrl = token?.networkType === 'testnet' 
        ? 'https://testnet.toncenter.com/api/v2'
        : 'https://toncenter.com/api/v2';
      
      const response = await fetch(
        `${baseUrl}/getAddressBalance?address=${address}`
      );
      const data = await response.json();
      
      if (data.ok) {
        setTonBalance((Number(data.result) / 1e9).toFixed(4));
      }
    } catch (error) {
      console.error('Error fetching TON balance:', error);
    }
  };

  const getTokenBalance = async (ownerAddress: string) => {
    if (!token?.tokenAddress) {
      console.log('No token address available');
      return;
    }

    try {
      console.log('Fetching token balance for:', {
        ownerAddress,
        tokenAddress: token.tokenAddress,
        network: token.networkType
      });

      const endpoint = await getHttpEndpoint({
        network: token.networkType === 'testnet' ? "testnet" : "mainnet",
      });
      console.log('Using endpoint:', endpoint);

      const client = new TonClient({ endpoint });
      const masterAddress = Address.parse(token.tokenAddress);
      console.log('Jetton master address:', masterAddress.toString());

      // Get jetton wallet address for the user
      const jettonMaster = await JettonMasterTemplate.fromAddress(masterAddress);
      const jettonWalletAddress = await jettonMaster.getGetWalletAddress(client.provider(masterAddress), Address.parse(ownerAddress));
      console.log('Jetton wallet address:', jettonWalletAddress.toString());

      // Get balance from wallet
      try {
        const jettonWallet = await JettonWalletTemplate.fromAddress(jettonWalletAddress);
        const walletData = await jettonWallet.getGetWalletData(client.provider(jettonWalletAddress));
        const formattedBalance = fromNano(walletData.balance);
        console.log('Contract Balance:', {
          raw: walletData.balance.toString(),
          formatted: formattedBalance
        });
        setTokenBalance(formattedBalance);
      } catch (error) {
        console.log('Wallet not deployed yet or error fetching balance:', error);
        setTokenBalance('0');
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      // If wallet doesn't exist yet, balance is 0
      if ((error as Error).message?.includes('not exist')) {
        console.log('Wallet does not exist yet, setting balance to 0');
        setTokenBalance('0');
        return;
      }
      // Set balance to 0 on error
      setTokenBalance('0');
      
      // Show error to user
      toast.error('Failed to fetch token balance. Please try again.');
    }
  };

  // Add this effect to fetch balances when wallet connects
  useEffect(() => {
    const getUserAddress = async () => {
      return tonConnectUI.account?.address || '';
    };

    if (tonConnectUI.account?.address && token?.tokenAddress) {
      // Get TON balance
      fetchTonBalance(tonConnectUI.account.address);
      
      // Get token balance
      getTokenBalance(tonConnectUI.account.address);

      // Refresh balances every 10 seconds
      const interval = setInterval(() => {
        if (tonConnectUI.account) {
          fetchTonBalance(tonConnectUI.account.address);
          getTokenBalance(tonConnectUI.account.address);
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [tonConnectUI.account?.address, token?.tokenAddress]);

  useEffect(() => {
    const loadToken = async () => {
      if (!tokenId) {
        toast.error('Invalid token ID');
        navigate('/tokens');
        return;
      }

      try {
        const response = await api.getToken(tokenId);
        if (response.success && response.token) {
          const tokenData = response.token as unknown as Token;
          setToken(tokenData);
        } else {
          toast.error('Token not found');
          navigate('/tokens');
        }
      } catch (error) {
        console.error('Error loading token:', error);
        toast.error('Failed to load token');
        navigate('/tokens');
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, [tokenId, navigate]);

  useEffect(() => {
    const loadAgent = async () => {
      if (!tokenId) return;
      
      try {
        setIsAgentLoading(true);
        setAgentError(null);
        
        // First try to load from database
        const agent = new AIAgent(tokenId);
        await agent.initialize();
        setAgent(agent);
      } catch (error) {
        console.error('Error loading agent:', error);
        setAgentError('Failed to load AI agent');
        toast.error('Failed to load AI agent');
      } finally {
        setIsAgentLoading(false);
      }
    };

    if (token) {
      loadAgent();
    }
  }, [token, tokenId]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!tokenId) return;
      
      try {
        const response = await axios.get(`${BASE_URL}/api/conversations/${tokenId}`);
        if (response.data.success) {
          setMessages(response.data.conversations.messages || []);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Don't show error toast for 404 as it's expected for new tokens
        if ((error as any).response?.status !== 404) {
          toast.error('Failed to load conversations');
        }
      }
    };

    if (token) {
      loadConversations();
    }
  }, [token, tokenId]);

  useEffect(() => {
    if (!chartContainerRef.current || !token) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#2C3E50',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4A90E2',
      downColor: '#EF5350',
      borderVisible: false,
      wickUpColor: '#4A90E2',
      wickDownColor: '#EF5350',
    });

    const generateSampleData = () => {
      const data = [];
      let time = new Date();
      time.setHours(0, 0, 0, 0);
      let basePrice = token.price || 1;
      
      for (let i = 0; i < 100; i++) {
        const volatility = 0.02;
        const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
        const close = open * (1 + (Math.random() - 0.5) * volatility);
        const high = Math.max(open, close) * (1 + Math.random() * volatility);
        const low = Math.min(open, close) * (1 - Math.random() * volatility);

        data.push({
          time: time.getTime() / 1000 + i * 3600 as UTCTimestamp,
          open,
          high,
          low,
          close,
        });

        basePrice = close;
      }
      return data;
    };

    candlestickSeries.setData(generateSampleData());

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [token]);

  useEffect(() => {
    if (token?.tokenAddress && token.inPool) {
      getTokenPrice();
    }
  }, [token?.tokenAddress, token?.inPool]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !agent || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    try {
      setIsLoading(true);
      
      // Add user message immediately
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
        address: tonConnectUI.account?.address || 'Unknown'
      };
      setMessages(prev => [...prev, userMsg]);
      
      // Get response from agent
      const response = await agent.handleForumMessage(userMessage);
      
      // Add agent response
      const agentMsg: ChatMessage = {
        role: 'agent',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, agentMsg]);
      
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          content: 'Sorry, I encountered an error while processing your message. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!tonConnectUI.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const client = getTonClient();
      setLoading(true);
      const sender = new TonConnectSender(tonConnectUI.connector);
      const factoryAddress = Address.parse('EQDECvJ2XNXLC54lOtN6uH2QwxMHxRVHlSxAlZSJwYPfHBho');
      const factoryContract = await JettonFactory.fromAddress(factoryAddress);

      const totalAmount = parseFloat(fromAmount) + TRANSACTION_FEE;

      await factoryContract.send(
        client.provider(factoryContract.address),
        sender,
        {
          value: toNano(totalAmount.toString()),
          bounce: false
        },
        {
          $$type: 'BuyFromPool',
          jettonMasterAddress: Address.parse(token?.tokenAddress || '')
        }
      );

      toast.success('Buy transaction submitted!');
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast.error('Failed to buy tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!tonConnectUI.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const client = getTonClient();
      setLoading(true);
      const sender = new TonConnectSender(tonConnectUI.connector);
      const factoryAddress = Address.parse('EQDECvJ2XNXLC54lOtN6uH2QwxMHxRVHlSxAlZSJwYPfHBho');
      const factoryContract = await JettonFactory.fromAddress(factoryAddress);

      await factoryContract.send(
        
        client.provider(factoryContract.address),
        sender,
        {
          value: toNano('0.5'),
          bounce: false
        },
        {
          $$type: 'SellFromPool',
          jettonMasterAddress: Address.parse(token?.tokenAddress || ''),
          amount: toNano(fromAmount)
        }
      );

      toast.success('Sell transaction submitted!');
    } catch (error) {
      console.error('Error selling tokens:', error);
      toast.error('Failed to sell tokens');
    } finally {
      setLoading(false);
    }
  };

  const renderChatSection = () => {
    if (isAgentLoading) {
      return (
        <div className="bg-[#F5F7FA] rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-[#2C3E50]">Loading AI agent...</div>
          </div>
        </div>
      );
    }

    if (agentError) {
      return (
        <div className="bg-[#F5F7FA] rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-red-400">{agentError}</div>
          </div>
        </div>
      );
    }

    if (!agent) {
      return (
        <div className="bg-[#F5F7FA] rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-[#2C3E50]">AI agent not available</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-[#F5F7FA] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2C3E50]">Chat with {token?.name || 'Token'} AI Agent</h2>
          <span className="px-2 py-1 text-xs bg-[#4A90E2] text-white rounded-full">
            Live
          </span>
        </div>

        <div className="h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-xs text-[#2C3E50] mb-1">
                  {msg.role === 'user' ? (
                    <span className="font-mono">{msg.address}</span>
                  ) : (
                    <span className="font-medium">{token?.name} AI</span>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-[#F5F7FA] ml-auto max-w-[80%]' 
                    : 'bg-[#4A90E2] text-[#2C3E50] mr-auto max-w-[80%]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask the AI agent anything..."
              className="flex-1 px-4 py-2 rounded-lg bg-[#F5F7FA] border border-[#2C3E50] focus:outline-none focus:border-[#4A90E2]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-6 py-2 bg-[#4A90E2] text-[#2C3E50] rounded-lg hover:bg-[#6BB9F0] disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Scroll to bottom of chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add this function to check if token is in pool
  const checkTokenInPool = async () => {
    if (!token?.tokenAddress) return;

    try {
      const endpoint = await getHttpEndpoint({
        network: token.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse("EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      const poolCore = PoolCore.fromAddress(poolCoreAddress);
      const contract = client.open(poolCore);

      const tokenAddress = Address.parse(token.tokenAddress);
      const hasPool = await contract.getHasPool(tokenAddress);
      
      setIsInPool(hasPool);
      
      // Update token.inPool as well to keep it in sync
      if (token.inPool !== hasPool) {
        token.inPool = hasPool;
      }
      
      console.log('Token in pool status:', {
        tokenAddress: token.tokenAddress,
        hasPool,
        networkType: token.networkType
      });
    } catch (error) {
      console.error('Error checking pool status:', error);
      setIsInPool(false);
    }
  };

  // Add this effect to check pool status periodically
  useEffect(() => {
    if (token?.tokenAddress) {
      checkTokenInPool();
      
      // Check pool status every 30 seconds
      const interval = setInterval(() => {
        checkTokenInPool();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [token?.tokenAddress]);

  // Check if current user is token creator
  useEffect(() => {
    const checkCreator = async () => {
      try {
        const endpoint = await getHttpEndpoint({
          network: token?.networkType === 'testnet' ? "testnet" : "mainnet",
        });
        const client = new TonClient({ endpoint });
        const userAddress = tonConnectUI.account?.address || '';
        
        // Compare normalized addresses
        const normalizedUserAddress = Address.parse(userAddress).toString();
        const normalizedCreatorAddress = token?.creatorAddress ? Address.parse(token.creatorAddress).toString() : '';
        
        setIsCreator(normalizedUserAddress === normalizedCreatorAddress);
        console.log('Creator check:', {
          userAddress: normalizedUserAddress,
          creatorAddress: normalizedCreatorAddress,
          isCreator: normalizedUserAddress === normalizedCreatorAddress
        });
      } catch (error) {
        console.error('Error checking creator status:', error);
        setIsCreator(false);
      }
    };
    
    if (token?.creatorAddress) {
      checkCreator();
    }
  }, [token]);

  // Check Twitter connection status
  useEffect(() => {
    const checkTwitterStatus = async () => {
      try {
        if (!token?._id) return;
        
        const response = await api.get(`/api/agent/${token._id}`);
        console.log('Twitter status response:', response.data);
        
        if (response.data?.agent?.twitter?.authorized) {
          setTwitterConnected(true);
        }
      } catch (error) {
        console.error('Error checking Twitter status:', error);
      }
    };
    
    if (token && isCreator) {
      checkTwitterStatus();
    }
  }, [token, isCreator]);

  const handleTwitterConnect = async () => {
    try {
      // Initialize Twitter OAuth
      const authWindow = window.open('', '_blank', 'width=600,height=600');
      const twitterAuth = await api.post('/api/twitter/auth/init');
      if (authWindow) {
        authWindow.location.href = twitterAuth.data.authUrl;
      }

      // Listen for OAuth callback
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
          const { accessToken, refreshToken, username } = event.data;
          
          // Connect Twitter to agent
          if (token?._id) {
            await api.post(`/api/agent/${token._id}/twitter/connect`, {
              accessToken,
              refreshToken,
              username
            });
          }

          setTwitterConnected(true);
          toast.success('Twitter account connected successfully!');
          setShowTwitterModal(false);
        }
      });
    } catch (error) {
      console.error('Error connecting Twitter:', error);
      toast.error('Failed to connect Twitter account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50]"></div>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => navigate('/tokens')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center border border-[#4A90E2] rounded-lg p-4">
            <img src={token.imageUrl} alt={token.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-[#2C3E50]">{token.name}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-[#2C3E50]">{token.symbol}</span>
                <span className="px-2 py-0.5 text-xs bg-[#4A90E2] text-white rounded-full">
                  {token.agentType}
                </span>
                <span className="px-2 py-0.5 text-xs bg-[#2C3E50] text-white rounded-full">
                Token Address:  {token.tokenAddress}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Price and Stats */}
            <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-4  border border-[#4A90E2] rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#2C3E50]">Price</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">${'0.0001'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#2C3E50]">24h Change</p>
                  <p className={`text-lg font-medium ${(token.priceChange24h ?? 0) >= 0 ? 'text-[#4A90E2]' : 'text-red-400'}`}>
                    {(token.priceChange24h ?? 0) >= 0 ? '+' : ''}{(token.priceChange24h ?? 0).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Bonding Curve Progress */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#2C3E50]">Bonding Curve Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-[#2350e4]">{token.liquidityProgress?.toFixed(1) || '0'}%</span>
                  </div>
                </div>
              <div className="w-full h-4 bg-[#F5F7FA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#161616] to-[#6BB9F0] transition-all duration-500 ease-out"
                
                />
              </div>
              <div className="flex justify-between text-xs text-[#2C3E50] pt-1">
                <div>
                  <span className="block text-[#2C3E50]">Start</span>
                  <span>0 TON</span>
                </div>
                <div className="text-right">
                  <span className="block text-[#2C3E50]">Target</span>
                  <span>10,000 TON</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-[#2C3E50]">Market Cap</p>
                <p className="text-lg font-medium text-[#2C3E50]">${token.marketCap?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-[#2C3E50]">Volume (24h)</p>
                <p className="text-lg font-medium text-[#2C3E50]">${token.volume24h?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#F5F7FA] rounded-lg p-4  border border-[#4A90E2] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                {['15m', '1h', '4h', '1d'].map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setSelectedInterval(interval as any)}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedInterval === interval
                        ? 'bg-[#4A90E2] text-white'
                        : 'bg-[#F5F7FA] text-[#2C3E50] hover:bg-[#6BB9F0] hover:text-white'
                    }`}
                  >
                    {interval}
                  </button>
                ))}
              </div>
            </div>
            <div ref={chartContainerRef} className="w-full h-[400px]" />
          </div>

          {/* Tabs */}
          <div className="bg-[#F5F7FA]  border border-[#4A90E2] rounded-lg p-4 rounded-lg overflow-hidden">
            {renderChatSection()}
          
          </div>
        
          </div>

          {/* Right Column - Trading Interface and Chat */}
          <div className="space-y-6 ">
            {/* Trading Interface */}
            <div className="bg-[#F5F7FA] rounded-lg p-6 border border-[#4A90E2] rounded-lg p-4">
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-6">Trade {token.symbol}</h2>
              
              {!tonConnectUI.connected ? (
                <Button 
                  onClick={() => tonConnectUI.connectWallet()} 
                  className="w-full bg-[#4A90E2] hover:bg-[#6BB9F0] text-[#2C3E50]"
                >
                  Connect Wallet
                </Button>
              ) : (
                <>
                  <div className="space-y-4">
                    {/* Buy/Sell Tabs */}
                    <div className="flex space-x-1 mb-4">
                      <button
                        onClick={() => setTradeTab('buy')}
                        className={`flex-1 py-2 rounded-md ${
                          tradeTab === 'buy' ? 'bg-[#4A90E2] text-white' : 'text-[#2C3E50]'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setTradeTab('sell')}
                        className={`flex-1 py-2 rounded-md ${
                          tradeTab === 'sell' ? 'bg-[#4A90E2] text-white' : 'text-[#2C3E50]'
                        }`}
                      >
                        Sell
                      </button>
                    </div>

                    {/* Input Amount */}
                    <div className="bg-[#F5F7FA] rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#2C3E50]">
                          {tradeTab === 'buy' ? 'Pay (TON)' : `Pay (${token?.symbol})`}
                        </span>
                        <span className="text-[#2C3E50]">
                          Balance: {tradeTab === 'buy' 
                            ? `${tonBalance} TON` 
                            : `${tokenBalance} ${token?.symbol}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          placeholder="0.0"
                          className="bg-transparent text-xl text-[#2C3E50] outline-none flex-1"
                        />
                        <div className="flex items-center">
                          {tradeTab === 'buy' ? (
                            <>
                              <img src="https://ton.org/download/ton_logo_light_background.png" alt="ton" className="w-6 h-6 rounded-full" />
                              <span className="text-[#2C3E50]">TON</span>
                            </>
                          ) : (
                            <>
                              <img src={token?.imageUrl} alt={token?.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-[#2C3E50]">{token?.symbol}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    {tradeTab === 'buy' && (
                      <div className="space-y-2 text-sm text-[#2C3E50]">
                        <div className="flex justify-between">
                          <span>Amount</span>
                          <span>{fromAmount || '0'} TON</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction Fee</span>
                          <span>{TRANSACTION_FEE} TON</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span>Total</span>
                          <span>{(parseFloat(fromAmount || '0') + TRANSACTION_FEE).toFixed(2)} TON</span>
                        </div>
                      </div>
                    )}

                    {/* Output Amount */}
                    <div className="bg-[#F5F7FA] rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#2C3E50]">
                          {tradeTab === 'buy' ? `Receive (${token?.symbol})` : 'Receive (TON)'}
                        </span>
                        <span className="text-[#2C3E50]">
                          1 {token?.symbol} = {TOKEN_PRICE} TON
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          placeholder="0.0"
                          value={tradeTab === 'buy' 
                            ? (parseFloat(fromAmount || '0') / TOKEN_PRICE).toFixed(4) // TON to Token
                            : (parseFloat(fromAmount || '0') * TOKEN_PRICE).toFixed(4) // Token to TON
                          }
                          disabled
                          className="bg-transparent text-xl text-[#2C3E50] outline-none flex-1"
                        />
                        <div className="flex items-center gap-2 ml-2">
                          {tradeTab === 'buy' ? (
                            <>
                              <img src={token?.imageUrl} alt={token?.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-[#2C3E50]">{token?.symbol}</span>
                            </>
                          ) : (
                            <>
                              <img src="https://ton.org/download/ton_logo_light_background.png" alt="ton" className="w-6 h-6 rounded-full" />
                              <span className="text-[#2C3E50]">TON</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={tradeTab === 'buy' ? handleBuy : handleSell}
                      disabled={loading || !fromAmount || !tonConnectUI.connected}
                      className="w-full bg-[#4A90E2] hover:bg-[#6BB9F0]"
                    >
                      {!tonConnectUI.connected 
                        ? 'Connect Wallet'
                        : loading 
                          ? 'Processing...' 
                          : `${tradeTab === 'buy' ? `Buy for ${(parseFloat(fromAmount || '0') + TRANSACTION_FEE).toFixed(2)} TON` : `Sell ${token?.symbol}`}`}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Twitter Connect Section - Only visible to creator */}
            {isCreator && (
              <div className="mt-6 p-4 bg-[#F5F7FA] rounded-lg border border-[#2C3E50]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2C3E50]">Twitter Integration</h3>
                    <p className="text-sm text-[#2C3E50]">
                      {twitterConnected 
                        ? 'Your token agent is connected to Twitter and will post regular updates'
                        : 'Connect Twitter to enable your token agent to post automatic updates'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTwitterModal(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      twitterConnected
                        ? 'bg-[#F5F7FA] text-[#2C3E50]'
                        : 'bg-[#1DA1F2] hover:bg-[#1a8cd8] text-[#2C3E50]'
                    }`}
                    disabled={twitterConnected}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>{twitterConnected ? 'Connected' : 'Connect Twitter'}</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  {/* Twitter Connect Modal */}
  {showTwitterModal && (
    <div className="fixed inset-0 bg-[#2C3E50]/50 flex items-center justify-center z-50">
      <div className="bg-[#F5F7FA] rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Connect Twitter Account</h2>
        <p className="text-[#2C3E50] mb-6">
          Your token agent will be able to post regular updates about your token on Twitter. You can customize the posting frequency later.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowTwitterModal(false)}
            className="px-4 py-2 rounded-lg font-medium text-[#2C3E50] hover:text-[#4A90E2]"
          >
            Cancel
          </button>
          <button
            onClick={handleTwitterConnect}
            className="px-4 py-2 rounded-lg font-medium bg-[#1DA1F2] hover:bg-[#1a8cd8] text-[#2C3E50]"
          >
            Connect Twitter
          </button>
        </div>
      </div>
    </div>
  )}
};

export default TokenView;
