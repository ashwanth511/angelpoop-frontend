import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { NavBar } from '@/components/Blocks/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import type { TokenData } from '../../services/api';
import { useTonConnectUI } from '@tonconnect/ui-react';

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

const TokenCard = styled.div`
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
}

export const TokenList: React.FC = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await api.getTokens();
      if (response.success && Array.isArray(response.tokens)) {
        setTokens(response.tokens);
      } else {
        setTokens([]);
        toast.error('No tokens found');
      }
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to fetch tokens');
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenClick = (tokenId: string) => {
    console.log('Navigating to token:', tokenId);
    navigate(`/token/${tokenId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading tokens...</div>
      </div>
    );
  }

  return (
    <div>

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
        </Header>

        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/80 mb-4">No tokens found</p>
            <Button onClick={() => navigate('/launch')}>
              Launch Your First Token
            </Button>
          </div>
        ) : (
          <Grid>
            {tokens.map((token) => (
              <TokenCard 
                key={token._id} 
                onClick={() => handleTokenClick(token._id)}
                className="transition-transform duration-300 hover:scale-105"
              >
                <TokenImage src={token.imageUrl || 'https://picsum.photos/200'} alt={token.name} />
                <TokenInfo>
                  <TokenName>{token.name}</TokenName>
                  <TokenType>{token.agentType}</TokenType>
                  <TokenDescription>{token.description}</TokenDescription>
                </TokenInfo>
                <TokenMetrics>
                  <MetricItem>
                    <MetricLabel>Price</MetricLabel>
                    <MetricValue>${token.price || '0.00'}</MetricValue>
                  </MetricItem>
                  <MetricItem>
                    <MetricLabel>24h Change</MetricLabel>
                    <MetricValue className={token.priceChange24h && token.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}>
                      {token.priceChange24h ? `${token.priceChange24h.toFixed(2)}%` : '0.00%'}
                    </MetricValue>
                  </MetricItem>
                </TokenMetrics>
              </TokenCard>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};
