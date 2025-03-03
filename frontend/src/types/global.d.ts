declare global {
  interface Window {
    savedStream: MediaStream | null;
  }
}

declare type StreamType = 'video' | 'audio' | 'screen';

export {};
