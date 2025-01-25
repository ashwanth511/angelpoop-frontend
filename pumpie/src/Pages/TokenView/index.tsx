import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { api } from '../../services/api';
import { createChart, UTCTimestamp } from 'lightweight-charts';
import { ArrowLeft } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { AIAgent } from '@/services/aiAgent';

import axios from 'axios';
import { BASE_URL } from '@/config';
import { Address ,toNano,fromNano} from '@ton/core';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from '@ton/ton';
import { PoolCore } from '@/wrappers/tact_PoolCore';
import TonConnectSender from '@/hooks/TonConnectSender';
import { JettonWalletImp } from '@/wrappers/tact_JettonWalletImp';

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

  const calculatePrice = (supply: bigint, amount: bigint): number => {
    // Get initial price from token or default to 0
    const initialPrice = token?.price || 0;
    
    // Convert supply to TON units
    const supplyInTon = Number(fromNano(supply));
    
    // Simple linear price calculation based on liquidity
    // Price = Initial Price + (Liquidity in TON * 0.1)
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

      // Try both methods to get balance
      try {
        // Method 1: Using TonCenter API
        const baseUrl = token?.networkType === 'testnet' 
          ? 'https://testnet.toncenter.com/api/v2'
          : 'https://toncenter.com/api/v2';

        const tokenDataResponse = await fetch(
          `${baseUrl}/getTokenData?address=${token.tokenAddress}`
        );
        const tokenData = await tokenDataResponse.json();
        console.log('Token data from API:', tokenData);

        if (tokenData.ok) {
          const decimals = tokenData.result.decimals || 9;
          console.log('Token decimals:', decimals);
        }

        // Get wallet address for this token
        const walletResponse = await fetch(
          `${baseUrl}/getWalletAddress?account=${ownerAddress}&token=${token.tokenAddress}`
        );
        const walletData = await walletResponse.json();
        console.log('Wallet data from API:', walletData);

        if (walletData.ok) {
          // Get balance
          const balanceResponse = await fetch(
            `${baseUrl}/getAccountState?account=${walletData.result}`
          );
          const balanceData = await balanceResponse.json();
          console.log('Balance data from API:', balanceData);

          if (balanceData.ok) {
            const balance = balanceData.result.balance;
            const formattedBalance = fromNano(balance);
            console.log('API Balance:', formattedBalance);
            setTokenBalance(formattedBalance);
            return;
          }
        }
      } catch (apiError) {
        console.warn('Failed to get balance from API:', apiError);
      }

      // Method 2: Using Contract Methods
      try {
        const endpoint = await getHttpEndpoint({
          network: token.networkType === 'testnet' ? "testnet" : "mainnet",
        });
        console.log('Using endpoint:', endpoint);

        const client = new TonClient({ endpoint });
        const masterAddress = Address.parse(token.tokenAddress);
        console.log('Jetton master address:', masterAddress.toString());

        // Get jetton wallet address
        const jettonMaster = client.open(PoolCore.fromAddress(masterAddress));
        const jettonWalletAddress = await jettonMaster.getGetJettonAddress(Address.parse(ownerAddress));
        console.log('Jetton wallet address:', jettonWalletAddress.toString());

        // Get balance from wallet
        const jettonWallet = client.open(JettonWalletImp.fromAddress(jettonWalletAddress));
        const walletData = await jettonWallet.getGetWalletData();
        const formattedBalance = fromNano(walletData.balance);
        console.log('Contract Balance:', {
          raw: walletData.balance.toString(),
          formatted: formattedBalance
        });

        setTokenBalance(formattedBalance);
        return;
      } catch (contractError) {
        console.warn('Failed to get balance from contract:', contractError);
        // If wallet doesn't exist yet, balance is 0
        if ((contractError as Error).message?.includes('not exist')) {
          console.log('Wallet does not exist yet, setting balance to 0');
          setTokenBalance('0');
          return;
        }
        throw contractError;
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
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
        textColor: '#d1d5db',
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
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
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

  const BuyJetton = async () => {
    if (!tonConnectUI.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const sender = new TonConnectSender(tonConnectUI.connector);

      const endpoint = await getHttpEndpoint({
        network: token?.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });

      const Pool_ADDRESS = "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF";
      const poolCoreAddress = Address.parse(Pool_ADDRESS);

      const sampleJetton = client.open(PoolCore.fromAddress(poolCoreAddress));

      await sampleJetton.send(
        sender,
        {
          value: toNano(fromAmount),
        },
        {
          $$type: 'PoolBuy',
          jettonAddress: Address.parse(token?.tokenAddress || '')
        }
      );

      toast.success('Buy transaction submitted!');
      await getTokenPrice(); // Refresh price data
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast.error('Failed to buy tokens');
    } finally {
      setLoading(false);
    }
  };

  const SellJetton = async () => {
    if (!tonConnectUI.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const sender = new TonConnectSender(tonConnectUI.connector);

      const endpoint = await getHttpEndpoint({
        network: token?.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });

      const Pool_ADDRESS = "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF";
      const poolCoreAddress = Address.parse(Pool_ADDRESS);

      const sampleJetton = client.open(PoolCore.fromAddress(poolCoreAddress));

      const TOKEN_AMOUNT = toNano(fromAmount); // Convert input amount to nano

      await sampleJetton.send(
        sender,
        {
          value: toNano('0.5'),
        },
        {
          $$type: 'PoolSell',
          jettonAddress: Address.parse(token?.tokenAddress || ''),
          to: Address.parse(tonConnectUI.account!.address),
          amount: TOKEN_AMOUNT,
        }
      );

      toast.success('Sell transaction submitted!');
      await getTokenPrice(); // Refresh price data
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
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-black">Loading AI agent...</div>
          </div>
        </div>
      );
    }

    if (agentError) {
      return (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-red-400">{agentError}</div>
          </div>
        </div>
      );
    }

    if (!agent) {
      return (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-black">AI agent not available</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Chat with {token?.name || 'Token'} AI Agent</h2>
          <span className="px-2 py-1 text-xs bg-gray-700 text-green-300 rounded-full">
            Live
          </span>
        </div>

        <div className="h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-xs text-gray-500 mb-1">
                  {msg.role === 'user' ? (
                    <span className="font-mono">{msg.address}</span>
                  ) : (
                    <span className="font-medium">{token?.name} AI</span>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-gray-700 ml-auto max-w-[80%]' 
                    : 'bg-[#00FFA3] text-black mr-auto max-w-[80%]'
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
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#00FFA3]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-6 py-2 bg-[#00FFA3] text-black rounded-lg hover:bg-[#00DD8C] disabled:opacity-50"
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => navigate('/tokens')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center">
            <img src={token.imageUrl} alt={token.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-black">{token.name}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-black">{token.symbol}</span>
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-white rounded-full">
                  {token.agentType}
                </span>
                <span className="px-2 py-0.5 text-xs bg-black text-white rounded-full">
                  {token.creatorAddress}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  isInPool 
                    ? 'bg-green-800 text-green-200' 
                    : 'bg-red-800 text-red-200'
                }`}>
                  {isInPool ? 'In Pool' : 'Not in Pool'}
                </span>
                {token.networkType === 'testnet' && (
                  <span className="px-2 py-0.5 text-xs bg-red-800 text-white rounded-full">
                    Testnet
                  </span>
                )}
                {token.networkType === 'mainnet' && (
                  <span className="px-2 py-0.5 text-xs bg-green-800 text-white rounded-full">
                    Mainnet
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Price and Stats */}
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-black">Price</p>
                  <p className="text-2xl font-bold">${token.price?.toFixed(4) || '0.00'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-black">24h Change</p>
                  <p className={`text-lg font-medium ${(token.priceChange24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(token.priceChange24h ?? 0) >= 0 ? '+' : ''}{(token.priceChange24h ?? 0).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Bonding Curve Progress */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-black">Bonding Curve Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-white">{token.liquidityProgress?.toFixed(1) || '0'}%</span>
                    {token.inPool && (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                        In Pool
                      </span>
                    )}
                  </div>
                </div>
              <div className="w-full h-4 bg-black rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00FFA3] to-[#00DD8C] transition-all duration-500 ease-out"
                  style={{ 
                    width: `${Math.min(100, token.liquidityProgress || 0)}%`,
               
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-black pt-1">
                <div>
                  <span className="block text-black">Start</span>
                  <span>0 TON</span>
                </div>
                <div className="text-right">
                  <span className="block text-black">Target</span>
                  <span>10,000 TON</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-black">Market Cap</p>
                <p className="text-lg font-medium">${token.marketCap?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-black">Volume (24h)</p>
                <p className="text-lg font-medium">${token.volume24h?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                {['15m', '1h', '4h', '1d'].map((interval) => (
                  <button
                    key={interval}
                    onClick={() => setSelectedInterval(interval as any)}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedInterval === interval
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-black hover:bg-gray-600'
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
          <div className="bg-gray-800/50 rounded-lg overflow-hidden">
            {renderChatSection()}
          
          </div>
        
          </div>

          {/* Right Column - Trading Interface and Chat */}
          <div className="space-y-6">
            {/* Trading Interface */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Trade {token.symbol}</h2>
              
              {!tonConnectUI.connected ? (
                <Button 
                  onClick={() => tonConnectUI.connectWallet()} 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Connect Wallet
                </Button>
              ) : (
                <>
                  {/* Buy/Sell Tabs */}
                  <div className="flex space-x-1 mb-4 bg-gray-900/50 p-1 rounded-lg">
                    <button
                      onClick={() => setTradeTab('buy')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        tradeTab === 'buy'
                          ? 'bg-blue-500 text-white'
                          : 'text-black hover:text-white'
                      }`}
                    >
                      Buy Dude
                    </button>
                    <button
                      onClick={() => setTradeTab('sell')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        tradeTab === 'sell'
                          ? 'bg-red-500 text-white'
                          : 'text-black hover:text-white'
                      }`}
                    >
                      Sell Bro
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-black">
                          {tradeTab === 'buy' ? 'Pay (TON)' : `Pay (${token?.symbol})`}
                        </span>
                        <span className="text-black">
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
                          className="bg-transparent text-xl text-white outline-none flex-1"
                        />
                        <div className="flex items-center gap-2">
                          {tradeTab === 'buy' ? (
                            <>
                          <img src="https://ton.org/download/ton_logo_light_background.png" alt="ton" className="w-6 h-6 rounded-full" />
                          <span className="text-white">TON</span>
                          </>
                          ) : (
                            <>
                              <img src={token?.imageUrl} alt={token?.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-white">{token?.symbol}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-black">
                          {tradeTab === 'buy' ? `Receive (${token?.symbol})` : 'Receive (TON)'}
                        </span>
                        <span className="text-black">
                          Price: 1 {token?.symbol} = {token?.price?.toFixed(4)} TON
                        </span>
                      </div>
                      <div className="flex items-center">
                    
                        <input
                          type="number"
                          placeholder="0.0"
                          value={(parseFloat(fromAmount || '0') * (currentPrice || 0)).toFixed(4)}
                          disabled
                          className="bg-transparent text-xl text-white outline-none flex-1"
                        />
                        <div className="flex items-center gap-2 ml-2 px-4 py-2 rounded-lg bg-gray-700">
                          {tradeTab === 'buy' ? (
                            <>
                              <img src={token?.imageUrl} alt={token?.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-white">{token?.symbol}</span>
                            </>
                          ) : (
                            <>
                            <img src="https://ton.org/download/ton_logo_light_background.png" alt="ton" className="w-6 h-6 rounded-full" />
                            <span className="text-white">TON</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-black">
                        <span>Pool Liquidity</span>
                        <div className="text-right">
                          <div>{formatCurrency(Number(fromNano(tokenSupply || '0')))}</div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(Number(fromNano(tokenSupply || '0')) * tonPrice, 'USD')}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-black">
                        <span>Price Impact</span>
                        <span>{((parseFloat(fromAmount || '0') / (parseFloat(tokenSupply || '0') + parseFloat(fromAmount || '0'))) * 100).toFixed(2)}%</span>
                      </div>

                      {/* Liquidity Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-black mb-1">
                          <span>Progress to DEX Migration</span>
                          <div className="text-right">
                            <div>{formatCurrency(liquidityProgress)}</div>
                            <div className="text-xs text-gray-500">Target: {formatCurrency(10000)} ({formatCurrency(10000 * tonPrice, 'USD')})</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (liquidityProgress / 10000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={tradeTab === 'buy' ? BuyJetton : SellJetton}
                      disabled={loading || !fromAmount || !tonConnectUI.connected}
                      className={`w-full ${
                        tradeTab === 'buy' 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {!tonConnectUI.connected 
                        ? 'Connect Wallet'
                        : loading 
                          ? 'Processing...' 
                          : `${tradeTab === 'buy' ? 'Buy' : 'Sell'} ${token.symbol}`}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Twitter Connect Section - Only visible to creator */}
            {isCreator && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Twitter Integration</h3>
                    <p className="text-sm text-black">
                      {twitterConnected 
                        ? 'Your token agent is connected to Twitter and will post regular updates'
                        : 'Connect Twitter to enable your token agent to post automatic updates'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTwitterModal(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      twitterConnected
                        ? 'bg-gray-700 text-black'
                        : 'bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white shadow-lg hover:shadow-[#1DA1F2]/20'
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Connect Twitter Account</h2>
        <p className="text-black mb-6">
          Your token agent will be able to post regular updates about your token on Twitter. You can customize the posting frequency later.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowTwitterModal(false)}
            className="px-4 py-2 rounded-lg font-medium text-black hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleTwitterConnect}
            className="px-4 py-2 rounded-lg font-medium bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
          >
            Connect Twitter
          </button>
        </div>
      </div>
    </div>
  )}
};

export default TokenView;
