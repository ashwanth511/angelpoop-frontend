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
import { JettonCore } from '@/wrappers/JettonCore';
import TonConnectSender from '@/hooks/TonConnectSender';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TokenData } from '@/types/types';

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
  // const [val, setVal] = useState<null | number>(null);
  // const [showVal, setShowVal] = useState<boolean>(false);

  // Constants for token deployment
  const Max_Supply: bigint = 100000000000000000000n;
  const initial_Price: bigint = 10000n;
  const iinitial_mint_Amount: bigint = 10000000000000n;
  const PoolCore_ADDRESS = "EQABFPp8oXtArlOkPbGlOLXsi9KUT7OWMJ1Eg0sLHY2R54RF";

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
          'pinata_api_key': 'c9a4d9a86b1b928093b0',
          'pinata_secret_api_key': 'f5390adfe05b02de0427111b8f707ffe938b93dc00f8fa17ba34d20dfb306b7f',
        },
      });

      const ipfsHash = response.data.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
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
        return;
      }

      if (!formData.tokenName || !formData.description || !formData.projectDescription || !formData.imageFile) {
        toast.error('Please fill in all required fields and upload an image');
        return;
      }

      // Upload image to IPFS
      let imageUrl = '';
      if (formData.imageFile) {
        try {
          toast.loading('Uploading image to IPFS...');
          imageUrl = await uploadToIPFS(formData.imageFile);
        } catch (error) {
          toast.error('Failed to upload image to IPFS');
          return;
        }
      }

      // Check for existing tokens
      const existingTokens = await api.getTokens();
      if (existingTokens.success && Array.isArray(existingTokens.tokens)) {
        const tokenExists = existingTokens.tokens.some(
          token => token.name.toLowerCase() === formData.tokenName.toLowerCase()
        );
        if (tokenExists) {
          toast.error('A token with this name already exists');
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

        const client = new TonClient({ endpoint });
        const poolCoreAddress = Address.parse(PoolCore_ADDRESS);

        const jettonParams = {
          name: formData.tokenName,
          description: formData.description,
          symbol: formData.tokenSymbol,
          image: imageUrl, // Using the IPFS URL here
        };

        // Create content Cell
        const content = buildOnchainMetadata(jettonParams);

        const sampleJetton = client.open(
          await JettonCore.fromInit(
            sender.address as Address,
            content,
            Max_Supply,
            initial_Price,
            iinitial_mint_Amount,
            poolCoreAddress
          )
        );

        // Get contract address before deployment
        tokenAddress = sampleJetton.address.toString({
          testOnly: network === 'testnet',
          bounceable: true,
          urlSafe: true
        });

        await sampleJetton.send(
          sender,
          {
            value: toNano('0.05'),
          },
          {
            $$type: 'Deploy',
            queryId: 0n
          }
        );

        toast.success('Token contract deployed successfully!');
      } catch (error) {
        console.error('Error deploying contract:', error);
        toast.error('Failed to deploy token contract');
        setIsLoading(false);
        return;
      }

      // Create token in database
      const networkType = network === 'testnet' ? 'testnet' : 'mainnet' as const;

      const tokenData: TokenData = {
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        totalSupply: Max_Supply.toString(),
        description: formData.description,
        projectDescription: formData.projectDescription,
        agentType: formData.agentType,
        creatorAddress: getNonBounceableAddress(wallet.address, network === 'testnet'),
        imageUrl,
        networkType,
        tokenAddress,
        liquidityProgress: 0,
        _id: '',
        decimals: 0,
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
          setShowSuccessModal(true);
          
          // Navigate after a delay
          setTimeout(() => {
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
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Token Name*
        </label>
        <input
          type="text"
          name="tokenName"
          value={formData.tokenName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          placeholder="Enter token name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Token Symbol*
        </label>
        <input
          type="text"
          name="tokenSymbol"
          value={formData.tokenSymbol}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          placeholder="Enter token symbol"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Description*
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          placeholder="Enter token description"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Agent Type*
        </label>
        <select
          name="agentType"
          value={formData.agentType}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
        >
          <option value="entertainment">Entertainment</option>
          <option value="defi">DeFi</option>
          <option value="gaming">Gaming</option>
          <option value="social">Social</option>
          <option value="utility">Utility</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Token Image*
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          required
        />
        {formData.imageFile && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(formData.imageFile)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Website (Optional)
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Telegram (Optional)
        </label>
        <input
          type="text"
          name="telegram"
          value={formData.telegram}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          placeholder="@your_telegram"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Twitter/X (Optional)
        </label>
        <input
          type="text"
          name="twitter"
          value={formData.twitter}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
          placeholder="@your_twitter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Project Description*
        </label>
        <textarea
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#00FFA3] focus:border-transparent"
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <NavBar />
        <div className="flex items-center justify-between p-5 mb-6">
          <h1 className="text-2xl font-bold text-black">Launch Your Token</h1>
          <div className="text-black">
            Step {step} of 2
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-[#00FFA3] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        <Card className="bg-gray-900 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? renderStep1() : renderStep2()}

            <div className="flex justify-between pt-4">
              {step === 2 && (
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  Back
                </Button>
              )}
              
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#00FFA3] text-black hover:bg-[#00DD8C]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#00FFA3] text-black hover:bg-[#00DD8C] disabled:opacity-50"
                >
                  {isLoading ? 'Launching...' : 'Launch Token'}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#00FFA3]">
                🎉 Congratulations!
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                <div className="space-y-4 mt-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Token Details:</h3>
                    <p>Name: {launchedToken?.name}</p>
                    <p>Type: {launchedToken?.agentType}</p>
                    <p>Network: {network}</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">What's Next?</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Your token is now live and ready to interact</li>
                      <li>You can manage your token from the dashboard</li>
                      <li>Share your token with the community</li>
                      <li>Start engaging with users through your token</li>
                    </ul>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => {
                        setShowSuccessModal(false);
                        navigate(`/token/${launchedToken?.id}`);
                      }}
                      className="bg-[#00FFA3] text-black hover:bg-[#00DD8C]"
                    >
                      View My Token
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LaunchToken;
