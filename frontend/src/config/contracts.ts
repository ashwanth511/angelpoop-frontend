export const NETWORK = {
    TESTNET: {
        ENDPOINT: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        API_KEY: 'd1b836f416e25475772900353fed639f035584cd96258445b46d9674711ad3b8',
        EXPLORER: 'https://testnet.tonscan.org',
    },
    MAINNET: {
        ENDPOINT: 'https://toncenter.com/api/v2/jsonRPC',
        API_KEY: '0292a8626c4afd8fd0e745e3692692b77e9f089dcdfaf5f1d3649b65e29d4500',
        EXPLORER: 'https://tonscan.org',
    }
};

// Current network configuration - Set to TESTNET
export const CURRENT_NETWORK = NETWORK.TESTNET;

export const CONTRACT_ADDRESSES = {
    // Testnet addresses
    FACTORY: 'EQA_YOUR_TESTNET_FACTORY_ADDRESS',
    ROUTER: 'EQA_YOUR_TESTNET_ROUTER_ADDRESS',
};

export const CONTRACT_FEES = {
    DEPLOY_POOL: '1.3',
    SWAP: '0.1',
};

// Testnet configuration for TonConnect
export const TON_CONNECT_CONFIG = {
    manifestUrl: '/src/assets/tonconnect-manifest.json',
    walletsList: 'https://raw.githubusercontent.com/ton-blockchain/wallet-lists/main/testnet.json'
};
