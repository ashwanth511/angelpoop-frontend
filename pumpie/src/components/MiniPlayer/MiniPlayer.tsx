import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { VideoPlayer } from '../shared/VideoPlayer';
import { IoClose, IoExpand } from 'react-icons/io5';
import toast from 'react-hot-toast';

type AnimeEffect = 'rainbow' | 'ninja' | 'neko' | 'kawaii' | 'none';

interface Props {
  onClose?: () => void;
  onClick?: () => void;
}

const MiniPlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 169px;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const VideoWrapper = styled.div<{ effectType: AnimeEffect }>`
  position: relative;
  width: 100%;
  height: 100%;

  ${props => props.effectType === 'rainbow' && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(255, 182, 193, 0.3),
        rgba(255, 218, 185, 0.3),
        rgba(255, 192, 203, 0.3)
      );
      mix-blend-mode: screen;
      animation: rainbowAnime 3s linear infinite;
      pointer-events: none;
    }

    @keyframes rainbowAnime {
      0% { opacity: 0.5; }
      50% { opacity: 0.8; }
      100% { opacity: 0.5; }
    }
  `}

  ${props => props.effectType === 'ninja' && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.4) 0%,
        transparent 40%,
        transparent 60%,
        rgba(0, 0, 0, 0.4) 100%
      );
      mix-blend-mode: multiply;
      animation: ninjaSlice 2s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes ninjaSlice {
      0% { transform: translateX(-100%) rotate(-45deg); }
      50% { transform: translateX(0%) rotate(-45deg); }
      100% { transform: translateX(100%) rotate(-45deg); }
    }
  `}

  ${props => props.effectType === 'neko' && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
        rgba(255, 182, 193, 0.3) 0%, 
        transparent 50%
      );
      mix-blend-mode: screen;
      pointer-events: none;
      animation: nekoGlow 2s ease-in-out infinite;
    }

    @keyframes nekoGlow {
      0% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(30deg); }
      100% { filter: hue-rotate(0deg); }
    }
  `}

  ${props => props.effectType === 'kawaii' && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(255, 182, 193, 0.3) 0%,
        rgba(255, 218, 185, 0.3) 50%,
        rgba(255, 192, 203, 0.3) 100%
      );
      mix-blend-mode: screen;
      animation: kawaiiSparkle 3s ease infinite;
      pointer-events: none;
    }

    @keyframes kawaiiSparkle {
      0% { 
        opacity: 0.5;
        filter: hue-rotate(0deg) brightness(1);
      }
      50% { 
        opacity: 0.8;
        filter: hue-rotate(15deg) brightness(1.2);
      }
      100% { 
        opacity: 0.5;
        filter: hue-rotate(0deg) brightness(1);
      }
    }
  `}
`;

interface ControlsProps {
  onClose: (e: React.MouseEvent) => void;
  onExpand: (e: React.MouseEvent) => void;
}

const Controls = React.memo<ControlsProps>(({ onClose, onExpand }) => {
  return (
    <div>
      <Button onClick={onExpand} title="Expand">
        <IoExpand />
      </Button>
      <Button onClick={onClose} title="Close">
        <IoClose />
      </Button>
    </div>
  );
});

const Button = styled.button`
  background: transparent;
  border: none;
  color: white;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const EffectButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const EffectButton = styled(Button)<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  font-size: 16px;
`;

const LiveIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  color: #ff0000;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #ff0000;
    border-radius: 50%;
    display: inline-block;
  }
`;

export const MiniPlayer: React.FC<Props> = ({ onClose, onClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [effectType, setEffectType] = useState<AnimeEffect>('kawaii');

  useEffect(() => {
    const checkStream = () => {
      if (window.savedStream) {
        const tracks = window.savedStream.getTracks();
        const active = tracks.some(track => track.enabled && track.readyState === 'live');
        setIsActive(active);
      } else {
        setIsActive(false);
      }
    };

    checkStream();
    const interval = setInterval(checkStream, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  }, [onClose]);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const toggleEffect = (effect: AnimeEffect) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setEffectType(prev => prev === effect ? 'none' : effect);
    toast.success(`${effect} mode ${effectType === effect ? 'off' : 'on'}! ✨`, {
      icon: getEffectIcon(effect),
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#333',
      },
    });
  };

  const getEffectIcon = (effect: AnimeEffect) => {
    switch (effect) {
      case 'rainbow': return '🌈';
      case 'ninja': return '🥷';
      case 'neko': return '😺';
      case 'kawaii': return '🌸';
      default: return '✨';
    }
  };

  if (!isActive) return null;

  return (
    <MiniPlayerContainer>
      <VideoWrapper effectType={effectType}>
        <Controls onClose={handleClose} onExpand={handleExpand} />
        <VideoPlayer muted playsInline autoPlay />
        <LiveIndicator>LIVE</LiveIndicator>
      </VideoWrapper>
    </MiniPlayerContainer>
  );
};
