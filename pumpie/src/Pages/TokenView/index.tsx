import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { api } from '../../services/api';
import { createChart } from 'lightweight-charts';
import { ArrowLeft } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { AIAgent } from '@/services/aiAgent';

import axios from 'axios';
import { BASE_URL } from '@/config';
import { Address ,toNano,address,Sender,fromNano} from '@ton/core';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from '@ton/ton';
import { PoolCore } from '@/wrappers/tact_PoolCore';
import TonConnectSender from '@/hooks/TonConnectSender';

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

  // Target liquidity amount to move to DEX (10,000 TON)
  const TARGET_LIQUIDITY = toNano('10000');
  const DEX_URL = token?.networkType === 'testnet' ? 
    'https://app.dedust.io/swap/testnet' :  // DeDust testnet
    'https://app.ston.fi/swap';             // Stonfi mainnet

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
      const poolCore = new PoolCore(poolCoreAddress);
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
          setToken(response.token);
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
        if (error.response?.status !== 404) {
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
          time: time.getTime() / 1000 + i * 3600,
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

  const handleTrade = async () => {
    if (!tonConnectUI.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check if token is in pool
    if (!token?.inPool) {
      toast.error('This token is not in the pool yet');
      return;
    }

    setLoading(true);
    try {
      const sender = new TonConnectSender(tonConnectUI.connector);
      const endpoint = await getHttpEndpoint({
        network: token.networkType === 'testnet' ? "testnet" : "mainnet",
      });

      const client = new TonClient({ endpoint });
      const poolCoreAddress = Address.parse(token.poolAddress || "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF");
      const poolCore = new PoolCore(poolCoreAddress);
      const contract = client.open(poolCore);

      // Parse token address
      let tokenAddress: Address;
      try {
        tokenAddress = Address.parse(token.tokenAddress!);
      } catch (error) {
        console.error('Error parsing token address:', error);
        toast.error('Invalid token address');
        return;
      }

      // Calculate price impact
      const supply = BigInt(tokenSupply || '0');
      const amount = toNano(fromAmount);
      const priceImpact = Number(amount) / (Number(supply) + Number(amount)) * 100;

      if (priceImpact > 10) {
        const proceed = window.confirm(`Warning: High price impact of ${priceImpact.toFixed(2)}%. Do you want to proceed?`);
        if (!proceed) {
          setLoading(false);
          return;
        }
      }

      // Get user's address for receiving tokens/TON
      const userAddress = Address.parse(tonConnectUI.account!.address);

      if (tradeTab === 'buy') {
        // Buy tokens
        await contract.send(
          sender,
          {
            value: toNano(fromAmount).add(toNano('0.1')), // Amount + gas
            bounce: false
          },
          {
            $$type: 'PoolBuy',
            jettonAddress: tokenAddress,
            to: userAddress,
            amount: toNano(fromAmount)
          }
        );
        toast.success(`Buying ${fromAmount} ${token.symbol}...`);
      } else {
        // For sell, we need to approve token transfer first
        const jettonWallet = client.open(new JettonWallet(tokenAddress));
        
        // First approve tokens
        await jettonWallet.send(
          sender,
          {
            value: toNano('0.1'), // Gas fee
            bounce: false
          },
          {
            $$type: 'ApproveTokens',
            spender: poolCoreAddress,
            amount: toNano(fromAmount)
          }
        );

        // Then sell tokens
        await contract.send(
          sender,
          {
            value: toNano('0.1'), // Gas fee
            bounce: false
          },
          {
            $$type: 'PoolSell',
            jettonAddress: tokenAddress,
            to: userAddress,
            amount: toNano(fromAmount)
          }
        );
        toast.success(`Selling ${fromAmount} ${token.symbol}...`);
      }

      // Clear input after successful transaction
      setFromAmount('');
      
      // Update token data
      await getTokenPrice();
      await fetchToken();

      // Show success message
      toast.success(`${tradeTab === 'buy' ? 'Buy' : 'Sell'} transaction submitted!`);
    } catch (error: any) {
      console.error('Error trading:', error);
      toast.error(`Failed to ${tradeTab} tokens: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderChatSection = () => {
    if (isAgentLoading) {
      return (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-gray-400">Loading AI agent...</div>
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
            <div className="text-gray-400">AI agent not available</div>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => navigate('/tokens')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center">
            <img src={token.imageUrl} alt={token.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">{token.name}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{token.symbol}</span>
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded-full">
                  {token.agentType}
                </span>
                <span className="px-2 py-0.5 text-xs bg-black text-gray-300 rounded-full">
                  {token.creatorAddress}
                </span>

                {
token.networkType === 'testnet' && (
                  <span className="px-2 py-0.5 text-xs bg-red-800 text-white rounded-full">
                    Testnet
                  </span>
                ) 
                }
                {
token.networkType === 'mainnet' && (
                  <span className="px-2 py-0.5 text-xs bg-green-800 text-white rounded-full">
                    Mainnet
                  </span>
                ) 
                }

              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Price</div>
                <div className="text-white text-lg font-semibold">
                  ${token.price?.toFixed(4)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">24h Change</div>
                <div className={`text-lg font-semibold ${
                  token.priceChange24h && token.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {token.priceChange24h?.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Market Cap</div>
                <div className="text-white text-lg font-semibold">
                  ${token.marketCap?.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">24h Volume</div>
                <div className="text-white text-lg font-semibold">
                  ${token.volume24h?.toLocaleString()}
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
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
              <div className="flex border-b border-gray-700">
                {['summary', 'developer', 'registry'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab as any)}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedTab === tab
                        ? 'text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {selectedTab === 'summary' && (
                  <div className="space-y-4">
                    <p className="text-gray-300">{token.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-2">Total Value Locked</h3>
                        <p className="text-gray-400">${token.totalValueLocked?.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-2">Holders</h3>
                        <p className="text-gray-400">{token.holders?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeTab('sell')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        tradeTab === 'sell'
                          ? 'bg-red-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">
                          {tradeTab === 'buy' ? 'Pay' : 'Sell Amount'}
                        </span>
                        <span className="text-gray-400">
                          Balance: {tradeTab === 'buy' ? '100 TON' : `0.00 ${token.symbol}`}
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
                              <img src={token?.imageUrl} alt={token?.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-white">{token?.symbol}</span>
                            </>
                          ) : (
                            <span className="text-white">TON</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">
                          {tradeTab === 'buy' ? 'Receive' : 'Receive'}
                        </span>
                        <span className="text-gray-400">
                          Price: 1 {token.symbol} = {token.price?.toFixed(4)} TON
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
                            <span className="text-white">TON</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Pool Liquidity</span>
                        <div className="text-right">
                          <div>{formatCurrency(Number(fromNano(tokenSupply || '0')))}</div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(Number(fromNano(tokenSupply || '0')) * tonPrice, 'USD')}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Price Impact</span>
                        <span>{((parseFloat(fromAmount || '0') / (parseFloat(tokenSupply || '0') + parseFloat(fromAmount || '0'))) * 100).toFixed(2)}%</span>
                      </div>

                      {/* Liquidity Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
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
                      onClick={handleTrade}
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

            {/* Forum Chat */}
            {renderChatSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenView;
