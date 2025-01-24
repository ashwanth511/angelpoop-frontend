import { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import { useNetwork } from '../../context/NetworkContext';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WalletInfo {
  balance: string;
  wallet_type: string;
  user_friendly_address: string;
}

interface AddressFormats {
  mainnet: {
    bounceable: string;    // EQ
    nonBounceable: string; // UQ
  };
  testnet: {
    bounceable: string;    // kQ
    nonBounceable: string; // 0Q
  };
}

// interface Transaction {
//   hash: string;
//   time: number;
//   from: string;
//   to: string;
//   amount: string;
//   fee: string;
// }

const getApiBaseUrl = (isTestnet: boolean) => {
  return isTestnet 
    ? 'https://testnet.toncenter.com/api/v2'
    : 'https://toncenter.com/api/v2';
};

function convertToUserFriendly(address: string, isTestnet: boolean): string {
  try {
    let rawAddress = address;
    
    // If it's already in a friendly format, parse it first
    if (address.match(/^(EQ|UQ|kQ|0Q)/)) {
      const addr = Address.parseFriendly(address);
      rawAddress = addr.address.toString();
    }
    
    const addr = Address.parse(rawAddress);
    // Use the correct method for non-bounceable address
    return addr.toString({
      testOnly: isTestnet,
      bounceable: false,
      urlSafe: true
    });
  } catch (error) {
    console.log('Address conversion error:', error);
    return address;
  }
}

export const Settings = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { network } = useNetwork();
  const { toast } = useToast();
  const [copied, setCopied] = useState<'mainnet-bounceable' | 'mainnet-nonbounceable' | 'testnet-bounceable' | 'testnet-nonbounceable' | null>(null);
  const [addresses, setAddresses] = useState<AddressFormats>({
    mainnet: {
      bounceable: '',
      nonBounceable: ''
    },
    testnet: {
      bounceable: '',
      nonBounceable: ''
    }
  });
  const [transactions, setTransactions] = useState<number>(0);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: '0.0000',
    wallet_type: 'unknown',
    user_friendly_address: 'Not Connected'
  });

  const generateAddressFormats = (rawAddress: string) => {
    try {
      let addr;
      
      // If it's already in a friendly format, parse it first
      if (rawAddress.match(/^(EQ|UQ|kQ|0Q)/)) {
        const parsed = Address.parseFriendly(rawAddress);
        addr = parsed.address;
      } else {
        addr = Address.parse(rawAddress);
      }

      // Generate all address formats
      setAddresses({
        mainnet: {
          bounceable: addr.toString({
            testOnly: false,
            bounceable: true,
            urlSafe: true
          }),
          nonBounceable: addr.toString({
            testOnly: false,
            bounceable: false,
            urlSafe: true
          })
        },
        testnet: {
          bounceable: addr.toString({
            testOnly: true,
            bounceable: true,
            urlSafe: true
          }),
          nonBounceable: addr.toString({
            testOnly: true,
            bounceable: false,
            urlSafe: true
          })
        }
      });
    } catch (error) {
      console.error('Error generating address formats:', error);
      toast({
        title: "Error",
        description: "Failed to generate address formats",
       
      });
    }
  };

  const fetchWalletData = async (address: string) => {
    try {
      const isTestnet = network === 'testnet';
      const baseUrl = getApiBaseUrl(isTestnet);
      
      const balanceResponse = await fetch(
        `${baseUrl}/getAddressBalance?address=${address}`
      );
      const balanceData = await balanceResponse.json();
      
      const txResponse = await fetch(
        `${baseUrl}/getTransactions?address=${address}`
      );
      const txData = await txResponse.json();

      setWalletInfo(prev => ({
        ...prev,
        balance: (Number(balanceData.result) / 1e9).toFixed(4),
        user_friendly_address: address,
    
      }));
      
      setTransactions(txData.result?.length || 0);

      // Generate all address formats
      generateAddressFormats(address);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet data. Please try again later.",

      });
    }
  };

  useEffect(() => {
    if (tonConnectUI.account?.address) {
      const userFriendlyAddress = convertToUserFriendly(
        tonConnectUI.account.address,
        network === 'testnet'
      );
      fetchWalletData(userFriendlyAddress);
      
      const interval = setInterval(() => {
        fetchWalletData(userFriendlyAddress);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [tonConnectUI.account?.address, network]);

  const formatAddress = (address: string) => {
    if (!address || address === 'Not Connected') return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string, type: 'mainnet-bounceable' | 'mainnet-nonbounceable' | 'testnet-bounceable' | 'testnet-nonbounceable') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy address",
  
      });
    }
  };

  // const shortAddress = formatAddress(walletInfo.user_friendly_address);
  const networkType = network === 'testnet' ? 'TON Testnet' : 'TON Mainnet';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold  text-white mb-8">Wallet Settings</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Network</p>
                <p className="font-medium">{networkType}</p>
              </div>
              <div>
                <p className="text-gray-600">Balance</p>
                <p className="font-medium">{walletInfo.balance} TON</p>
              </div>
              <div>
                <p className="text-gray-600">Wallet Type</p>
                <p className="font-medium">{walletInfo.wallet_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Recent Transactions</p>
                <p className="font-medium">{transactions}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            <div className="space-y-6">
              {/* Mainnet Addresses */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Mainnet</h3>
                <div>
                  <p className="text-gray-600">Bounceable Address (EQ)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono">{formatAddress(addresses.mainnet.bounceable)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(addresses.mainnet.bounceable, 'mainnet-bounceable')}
                    >
                      {copied === 'mainnet-bounceable' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Non-bounceable Address (UQ)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono">{formatAddress(addresses.mainnet.nonBounceable)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(addresses.mainnet.nonBounceable, 'mainnet-nonbounceable')}
                    >
                      {copied === 'mainnet-nonbounceable' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Testnet Addresses */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Testnet</h3>
                <div>
                  <p className="text-gray-600">Bounceable Address (kQ)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono">{formatAddress(addresses.testnet.bounceable)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(addresses.testnet.bounceable, 'testnet-bounceable')}
                    >
                      {copied === 'testnet-bounceable' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Non-bounceable Address (0Q)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono">{formatAddress(addresses.testnet.nonBounceable)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(addresses.testnet.nonBounceable, 'testnet-nonbounceable')}
                    >
                      {copied === 'testnet-nonbounceable' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Explorer Links</h2>
        <div className="space-y-2">
          <a
            href={`https://${network === 'testnet' ? 'testnet.' : ''}tonscan.org/address/${walletInfo.user_friendly_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            View on TONScan <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
