import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  &:focus-visible {
    outline: 2px solid #7C3AED;
    outline-offset: 2px;
  }
`;

interface Props {
  onClick?: () => void;
  showControls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export const VideoPlayer: React.FC<Props> = ({ 
  onClick, 
  showControls = false,
  autoPlay = true,
  muted = true,
  playsInline = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setupVideo = () => {
      if (window.savedStream) {
        video.srcObject = window.savedStream;
        video.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
    };

    setupVideo();

    // Check for stream changes and health
    const streamCheck = setInterval(() => {
      if (window.savedStream) {
        // If stream changed, update video
        if (video.srcObject !== window.savedStream) {
          setupVideo();
        }
        
        // Check if stream is still active
        const tracks = window.savedStream.getTracks();
        const isActive = tracks.some(track => track.enabled && track.readyState === 'live');
        if (!isActive) {
          video.srcObject = null;
        }
      } else if (video.srcObject) {
        video.srcObject = null;
      }
    }, 500);

    return () => {
      clearInterval(streamCheck);
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    };
  }, []);

  return (
    <Video
      ref={videoRef}
      onClick={onClick}
      controls={showControls}
      autoPlay={autoPlay}
      muted={muted}
      playsInline={playsInline}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      aria-label="Live stream video player"
      role="application"
    />
  );
};
