import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/Blocks/Navbar';
import { api } from '../../services/api';
import { createChart, ColorType } from 'lightweight-charts';
import { ArrowLeft } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface Token {
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

  useEffect(() => {
    const loadToken = async () => {
      if (!tokenId) {
        toast.error('Invalid token ID');
        navigate('/tokens');
        return;
      }

      try {
        const response = await api.getTokenById(tokenId);
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      address: '0x...' // Replace with actual user address
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
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
                        <div className="flex items-center space-x-2 ml-2 px-4 py-2 rounded-lg bg-gray-700">
                          {tradeTab === 'buy' ? (
                            <span className="text-white">TON</span>
                          ) : (
                            <>
                              <img src={token.imageUrl} alt={token.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-white">{token.symbol}</span>
                            </>
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
                          value={(parseFloat(fromAmount || '0') * (token.price || 0)).toFixed(4)}
                          disabled
                          className="bg-transparent text-xl text-white outline-none flex-1"
                        />
                        <div className="flex items-center space-x-2 ml-2 px-4 py-2 rounded-lg bg-gray-700">
                          {tradeTab === 'buy' ? (
                            <>
                              <img src={token.imageUrl} alt={token.symbol} className="w-6 h-6 rounded-full" />
                              <span className="text-white">{token.symbol}</span>
                            </>
                          ) : (
                            <span className="text-white">TON</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => {
                        toast.success(`${tradeTab === 'buy' ? 'Bought' : 'Sold'} ${token.symbol} successfully!`);
                      }}
                      className={`w-full ${
                        tradeTab === 'buy' 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {tradeTab === 'buy' ? 'Buy' : 'Sell'} {token.symbol}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Forum Chat */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Forum Chat</h2>
                <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                  Live
                </span>
              </div>

              <div className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user' ? 'bg-gray-700 ml-8' : 'bg-gray-900 mr-8'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-400">{msg.address}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp!).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-200">{msg.content}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-auto">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <Button type="submit">
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenView;
