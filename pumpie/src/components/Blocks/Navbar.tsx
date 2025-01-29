import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useNetwork } from '../../context/NetworkContext';
import logo from "@/assets/logo.png"
export const NavBar = () => {
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { network, setNetwork } = useNetwork();

  // Handle connection status changes
  useEffect(() => {
    const checkConnection = async (wallet: any) => {
      if (wallet) {
        setIsConnected(true);
        // Only redirect if we're on the home page
        if (window.location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setIsConnected(false);
        navigate('/', { replace: true });
      }
    };

    // Check initial connection
    checkConnection(tonConnectUI.account);

    // Subscribe to connection changes
    const unsubscribe = tonConnectUI.onStatusChange(checkConnection);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tonConnectUI, navigate]);

  const handleTonConnect = async () => {
    try {
      const result = await tonConnectUI.connectWallet();
      console.log('Connection result:', result);
      if (result) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const handleSettings = async () => {
 
     
      navigate('/settings', { replace: true });
   

  };

  const handleNetworkSwitch = (newNetwork: 'mainnet' | 'testnet') => {
    setNetwork(newNetwork);
    setIsDropdownOpen(false);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getNetworkBadgeStyle = () => {
    return network === 'testnet' 
      ? 'bg-yellow-500/10 text-yellow-500'
      : 'bg-green-500/10 text-green-500';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#4A90E2] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to={isConnected ? "/dashboard" : "/"} 
              className="text-white font-bold text-xl"
            >
              <img src={logo} className="w-40"/>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-black bg-[#ffffFF] hover:bg-[#4A90E2] rounded-lg transition-all"
                >
                  <span>{formatAddress(tonConnectUI.account?.address)}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getNetworkBadgeStyle()}`}>
                    {network === 'testnet' ? 'Testnet' : 'Mainnet'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-[#4A90E2]">
                    <div className="px-4 py-3 border-b border-[#F5F7FA]">
                      <p className="text-sm text-[#2C3E50]/60">Connected Wallet</p>
                      <p className="text-sm font-medium text-[#2C3E50] break-all">
                        {tonConnectUI.account?.address}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b border-[#F5F7FA]">
                      <p className="text-sm text-[#2C3E50]/60 mb-2">Network</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleNetworkSwitch('mainnet')}
                          className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            network === 'mainnet'
                              ? 'bg-[#4A90E2] text-white'
                              : 'bg-[#F5F7FA] text-[#2C3E50] hover:bg-[#6BB9F0] hover:text-white'
                          }`}
                        >
                          Mainnet
                        </button>
                        <button
                          onClick={() => handleNetworkSwitch('testnet')}
                          className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            network === 'testnet'
                              ? 'bg-[#4A90E2] text-white'
                              : 'bg-[#F5F7FA] text-[#2C3E50] hover:bg-[#6BB9F0] hover:text-white'
                          }`}
                        >
                          Testnet
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSettings}
                      className="w-full text-left px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#F5F7FA] transition-all"
                    >
                      Settings
                    </button>

                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#F5F7FA] transition-all rounded-b-lg"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isConnected && (
              <button
                onClick={handleTonConnect}
                className="px-6 py-2 text-sm font-medium text-white bg-[#6BB9F0] hover:bg-[#4A90E2] rounded-lg transition-all"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};