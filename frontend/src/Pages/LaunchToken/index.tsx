import React, { useState, ChangeEvent } from 'react';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAgentStore, AIAgentConfig } from "../../services/aiAgent";
import { NavBar } from '@/components/Blocks/Navbar';
import { api } from '../../services/api';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useNetwork } from '../../context/NetworkContext';
import { toNano, Address } from '@ton/core';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buildOnchainMetadata } from '@/utils/jetton-helpers';
import { TonClient } from '@ton/ton';
import TonConnectSender from '@/hooks/TonConnectSender';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TokenData } from '@/types/types';
import { JettonFactory } from '@/wrappers/tact_JettonFactory';
import { getTonClient } from '../../services/ton-client';
import { beginCell } from '@ton/core';
import { contractAddress } from '@ton/core';
import { JettonMasterTemplate } from '@/wrappers/tact_JettonMasterTemplate';
import { sha256 } from '@/utils/crypto-helpers';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface FormData {
  tokenName: string;
  tokenSymbol: string;
  description: string;
  imageFile: File | null;
  agentType: 'entertainment' | 'defi' | 'gaming' | 'social' | 'utility';
  website: string;
  telegram: string;
  twitter: string;
  projectDescription: string;
}

interface TokenResponse {
  success: boolean;
  token: TokenData;
}

interface LaunchedToken {
  name: string;
  agentType: string;
  id: string;
}

export const LaunchToken: React.FC = () => {
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();
  const { network } = useNetwork();
  const { createAgent } = useAgentStore();
  const { width, height } = useWindowSize();
  // const [val, setVal] = useState<null | number>(null);
  // const [showVal, setShowVal] = useState<boolean>(false);

  // Constants for token deployment
  let initialTokens = toNano('100000');
  let maxTokenSupply = 1000n * initialTokens;
  let initialPrice = toNano('0.0001');

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [launchedToken, setLaunchedToken] = useState<LaunchedToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    // Step 1 fields
    tokenName: '',
    tokenSymbol: '',
    description: '',
    imageFile: null,
    agentType: 'entertainment',
    
    // Step 2 fields
    website: '',
    telegram: '',
    twitter: '',
    projectDescription: '',
  });

  // Add confetti state
  const [showConfetti, setShowConfetti] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        imageFile: e.target.files![0]
      }));
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': 'dcb9c6b82e9be7eb839c',
          'pinata_secret_api_key': '8855c2a6ff3162c4ecb85a9421f581f97d98261f7ad0d0c9904f5732105177f3',
        },
      });

      const ipfsHash = response.data.IpfsHash;
      // Use your actual Pinata subdomain
      return `https://blue-static-marlin-360.mypinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload image to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const wallet = tonConnectUI.account;
      
      if (!wallet) {
        toast.error('Please connect your TON wallet first');
        setIsLoading(false);
        return;
      }

      if (!formData.tokenName || !formData.description || !formData.projectDescription || !formData.imageFile) {
        toast.error('Please fill in all required fields and upload an image');
        setIsLoading(false);
        return;
      }

      // Upload image to IPFS
      let imageUrl = '';
      try {
        toast.loading('Uploading image to IPFS...');
        imageUrl = await uploadToIPFS(formData.imageFile);
      } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        toast.error('Failed to upload image to IPFS');
        setIsLoading(false);
        return;
      }

      // Check for existing tokens
      const existingTokens = await api.getTokens();
      if (existingTokens.success && Array.isArray(existingTokens.tokens)) {
        const tokenExists = existingTokens.tokens.some(
          token => token.name.toLowerCase() === formData.tokenName.toLowerCase()
        );
        if (tokenExists) {
          toast.error('A token with this name already exists');
          setIsLoading(false);
          return;
        }
      }

      // Deploy contract first
      let tokenAddress = '';
      try {
        toast.loading('Deploying token contract...');
        
        const sender = new TonConnectSender(tonConnectUI.connector);
        const endpoint = await getHttpEndpoint({
          network: network === 'testnet' ? "testnet" : "mainnet",
        });

        // Get TonClient and create a proper ContractProvider
        const client = getTonClient();
        
        // Create proper metadata JSON for IPFS
        const metadata = {
          "name": formData.tokenName,
          "description": formData.description,
          "symbol": formData.tokenSymbol,
          "image": imageUrl
        };

        // Upload metadata to IPFS with pretty formatting
        const metadataBlob = new Blob([JSON.stringify(metadata, null, 4)], { type: 'application/json' });
        const metadataFile = new File([metadataBlob], 'metadata.json');
        console.log("Metadata content:", JSON.stringify(metadata, null, 4));
        toast.loading('Uploading metadata to IPFS...');
        const metadataUrl = await uploadToIPFS(metadataFile);
        console.log("Metadata URL:", metadataUrl);
        
        // Initialize JettonFactory contract
        try {

         // EQBmWR4EJgdZ9EbnFONcbSqdagvCEwMjvgSuXv5k4XlEjzjT
          
          const factoryAddress = Address.parse('EQDECvJ2XNXLC54lOtN6uH2QwxMHxRVHlSxAlZSJwYPfHBho');
          const factoryContract = await JettonFactory.fromAddress(factoryAddress);
          
          console.log('Sending LaunchToken message to factory...');
          
          // Send the transaction to the factory
          await factoryContract.send(
            client.provider(factoryContract.address),
            sender,
            {
              value: toNano('0.5'),
              bounce: false 
            },
            {
              $$type: 'LaunchToken',
              content: {
                $$type: 'Tep64TokenData',
                flag: BigInt(1), // 1 for off-chain (IPFS) metadata
                content: metadataUrl // Use the converted URL
              }
            }
          );

          // Wait for the transaction to be processed
          await new Promise(resolve => setTimeout(resolve, 10000));
          
          // Get the master contract address right after sending
          const jettonMasterContract = await JettonMasterTemplate.fromInit(
            factoryAddress,
            
            initialTokens,
            maxTokenSupply,
            initialPrice,
            
            {
              $$type: 'Tep64TokenData',
              flag: BigInt(1),
              content: metadataUrl
            }
          );
          const rawTokenAddress = jettonMasterContract.address.toString();
          // Convert to bounceable format for testnet/mainnet
          console.log('Raw token address:', rawTokenAddress);
          tokenAddress = Address.parse(rawTokenAddress).toString(


            {
              testOnly: network === 'testnet',
              bounceable: true,
              urlSafe: true
            }
          );

          console.log('Token address:', tokenAddress);
          console.log('Transaction sent. Token should appear in your wallet soon.');
          toast.success('Token launch transaction sent successfully!');
        } catch (error) {
          console.error('Error deploying contract:', error);
          toast.error('Failed to deploy token contract');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error in contract deployment process:', error);
        toast.error('Failed to deploy token contract');
        setIsLoading(false);
        return;
      }

      // Create token in database
      const networkType = network === 'testnet' ? 'testnet' : 'mainnet' as const;

      const tokenData: TokenData = {
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        totalSupply: maxTokenSupply.toString(),
        description: formData.description,
        projectDescription: formData.projectDescription,
        agentType: formData.agentType,
        creatorAddress: getNonBounceableAddress(wallet.address, network === 'testnet'),
        imageUrl,
        networkType,
        tokenAddress,
        liquidityProgress: 0,
        _id: '',
        decimals: 9,
        price: 0,
        priceChange24h: 0,
        marketCap: 0,
        volume24h: 0,
        totalValueLocked: 0,
        holders: 0,
        inPool: false,
        createdAt: '',
        updatedAt: '',
        __v: 0,
        poolAddress: ''
      } as const;

      try {
        const response = await api.createToken(tokenData) as TokenResponse;
        
        if (response.success && response.token) {
          // Create AI agent
          const agentConfig: AIAgentConfig = {
            telegramBotToken: '',
            projectDescription: formData.projectDescription,
            tokenName: formData.tokenName,
            tokenSymbol: formData.tokenSymbol,
            aiConfig: {
              handleAnnouncements: true,
              handleUserQueries: true,
              customInstructions: '',
              name: formData.tokenName,
              type: formData.agentType,
              description: formData.projectDescription
            },
            platformType: 'telegram' as const,
            tokenId: response.token._id,
            type: formData.agentType,
            name: formData.tokenName,
            initialLiquidity: '',
            tokenAddress: response.token.tokenAddress || ''
          };

          try {
            const agentResponse = await createAgent(agentConfig);
            if (agentResponse.success) {
              toast.success('🤖 AI Agent created successfully!');
            }
          } catch (error: any) {
            console.error('Error creating AI agent:', error);
            toast.error('Failed to create AI agent, but token was created');
          }
          
          setLaunchedToken({
            name: response.token.name,
            agentType: response.token.agentType,
            id: response.token._id
          });
          toast.success('🚀 Token launched successfully!');
          setShowConfetti(true); // Start confetti
          setShowSuccessModal(true);
          
          // Navigate after a delay and stop confetti
          setTimeout(() => {
            setShowConfetti(false);
            navigate(`/token/${response.token._id}`);
          }, 3000);
        } else {
          toast.error('Failed to launch token');
        }
      } catch (error) {
        console.error('Error creating token:', error);
        toast.error('Failed to create token in database');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while launching the token');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Token Name*
        </label>
        <input
          type="text"
          name="tokenName"
          value={formData.tokenName}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="Enter token name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Token Symbol*
        </label>
        <input
          type="text"
          name="tokenSymbol"
          value={formData.tokenSymbol}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="Enter token symbol"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Description*
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="Enter token description"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Agent Type*
        </label>
        <select
          name="agentType"
          value={formData.agentType}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          required
        >
          <option value="entertainment">Entertainment</option>
          <option value="defi">DeFi</option>
          <option value="gaming">Gaming</option>
          <option value="social">Social</option>
          <option value="utility">Utility</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Token Image*
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Website
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Telegram
        </label>
        <input
          type="text"
          name="telegram"
          value={formData.telegram}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="@your_telegram"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Twitter
        </label>
        <input
          type="text"
          name="twitter"
          value={formData.twitter}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="@your_twitter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2C3E50] mb-1">
          Project Description*
        </label>
        <textarea
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleInputChange}
          className="w-full p-2 border border-[#4A90E2] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6BB9F0]"
          placeholder="Enter detailed project description"
          rows={4}
          required
        />
      </div>
    </div>
  );

  const validateStep1 = () => {
    return formData.tokenName && 
           formData.tokenSymbol && 
           formData.description && 
           formData.imageFile;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="relative">
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false}
          colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
        />
      )}
      <div className="min-h-screen bg-[#FFFFFF] text-[#2C3E50]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E50]">Launch New Token</h1>
          </div>

          <Card className="max-w-3xl mx-auto p-6 bg-[#F5F7FA] border border-[#4A90E2]">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2C3E50]">
                  {step === 1 ? 'Token Information' : 'Project Information'}
                </h2>
                <div className="text-sm text-[#2C3E50]">Step {step} of 2</div>
              </div>

              <div className="flex mb-6">
                <div className="w-full bg-[#4A90E2] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6BB9F0] transition-all duration-300"
                    style={{ width: `${step * 50}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? renderStep1() : renderStep2()}

                <div className="flex justify-between pt-4">
                  {step === 2 && (
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-[#F5F7FA] text-[#2C3E50] border border-[#4A90E2] hover:bg-white"
                    >
                      Previous Step
                    </Button>
                  )}
                  
                  {step === 1 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-[#4A90E2] text-white hover:bg-[#6BB9F0]"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`bg-[#4A90E2] text-white hover:bg-[#6BB9F0] ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Launching...
                        </div>
                      ) : (
                        'Launch Token'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </Card>

          {/* Success Modal */}
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="bg-[#FFFFFF] text-[#2C3E50] p-6 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#2C3E50] mb-2">Token Launch Successful!</DialogTitle>
                <DialogDescription className="text-[#2C3E50]">
                  Your token has been successfully launched.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                {launchedToken && (
                  <>
                    <div>
                      <p className="font-medium">Token Name:</p>
                      <p>{launchedToken.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Agent Type:</p>
                      <p>{launchedToken.agentType}</p>
                    </div>
                  </>
                )}
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/dashboard');
                    }}
                    className="bg-[#4A90E2] text-white hover:bg-[#6BB9F0]"
                  >
                    Go to Dashboard
                  </Button>
                  {launchedToken && (
                    <Button
                      onClick={() => {
                        setShowSuccessModal(false);
                        navigate(`/token/${launchedToken.id}`);
                      }}
                      className="bg-[#4A90E2] text-white hover:bg-[#6BB9F0]"
                    >
                      View Token
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default LaunchToken;
