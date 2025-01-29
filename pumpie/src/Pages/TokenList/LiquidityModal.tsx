import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(44, 62, 80, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border: 1px solid #4A90E2;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #2C3E50;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #4A90E2;
  }
`;

const Title = styled.h2`
  color: #2C3E50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #2C3E50;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

interface LiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => void;
  tokenName: string;
}

export const LiquidityModal: React.FC<LiquidityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tokenName,
}) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    onConfirm(amount);
    setAmount('');
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        
        <Title>Add Liquidity to {tokenName}</Title>
        
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Label htmlFor="amount">Amount of TON to add as liquidity</Label>
            <Input
              id="amount"
              type="number"
              step="0.1"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount..."
              className="bg-[#F5F7FA] border-[#4A90E2] text-[#2C3E50] focus:border-[#6BB9F0]"
            />
          </InputWrapper>

          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-[#2C3E50] border-[#4A90E2] hover:bg-[#F5F7FA]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="bg-[#4A90E2] text-white hover:bg-[#6BB9F0]"
            >
              Add Liquidity
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
