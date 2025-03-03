// API Configuration
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Google AI Configuration
export const GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

// IPFS Configuration
export const PINATA_API_KEY = 'c9a4d9a86b1b928093b0';
export const PINATA_SECRET_KEY = 'f5390adfe05b02de0427111b8f707ffe938b93dc00f8fa17ba34d20dfb306b7f';

// TON Configuration
export const TON_ENDPOINT = import.meta.env.VITE_TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC';

// Environment
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;
