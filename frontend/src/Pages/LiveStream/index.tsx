import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChatBox } from '../../components/Chat/ChatBox';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LiveStreamContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background: rgba(255, 255, 255, 0.1);
  gap: 20px;
  padding: 20px;
`;

const VideoContainer = styled.div`
  flex: 1;
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChatContainer = styled.div`
  width: 350px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StreamControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
`;

const Button = styled.button<{ $variant?: 'danger' }>`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$variant === 'danger' ? '#ef4444' : '#10b981'};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VideoPlaceholder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
`;

export const LiveStreamPage: React.FC = () => {
  const { streamId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startStream = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        window.savedStream = stream;
        setIsStreaming(true);
        toast.success('Stream started successfully!');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = () => {
    if (window.savedStream) {
      window.savedStream.getTracks().forEach(track => track.stop());
      window.savedStream = null;
    }
    setIsStreaming(false);
    toast.success('Stream ended successfully!');
  };

  return (
    <LiveStreamContainer>
      <VideoContainer>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!isStreaming && (
          <VideoPlaceholder>
            <h2>Start streaming to begin</h2>
            <p>Your video will appear here</p>
          </VideoPlaceholder>
        )}
        <StreamControls>
          {!isStreaming ? (
            <Button 
              onClick={startStream} 
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'Start Stream'}
            </Button>
          ) : (
            <Button 
              $variant="danger"
              onClick={stopStream}
            >
              Stop Stream
            </Button>
          )}
        </StreamControls>
      </VideoContainer>
      <ChatContainer>
        <ChatBox />
      </ChatContainer>
    </LiveStreamContainer>
  );
};
