import { NETWORK } from '../config/contracts';
import { Address } from '@ton/core';
import { TonClient, fromNano } from '@ton/ton';

export interface WalletInfo {
    balance: string;
    wallet_type: string;
    user_friendly_address: string;
}

// Create TonClient instance
const tonClient = new TonClient({
    endpoint: NETWORK.TESTNET.ENDPOINT,
    apiKey: NETWORK.TESTNET.API_KEY
});

// TON address conversion utilities
const createBuffer = (str: string): Buffer => {
    const buffer = Buffer.alloc(36);
    buffer[0] = 0x11; // Non-bounceable address
    buffer[1] = 0x00; // Testnet flag
    buffer[2] = 0x00; // Workchain (0)
    Buffer.from(str, 'hex').copy(buffer, 3);
    return buffer;
};

const crc16 = (data: Buffer): number => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc ^= data[i] << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
            crc &= 0xFFFF;
        }
    }
    return crc;
};

const fetchTonCenter = async (method: string, params: any[]): Promise<any> => {
    try {
        const response = await fetch(NETWORK.TESTNET.ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': NETWORK.TESTNET.API_KEY
            },
            body: JSON.stringify({
                id: '1',
                jsonrpc: '2.0',
                method: method,
                params: params
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message || 'API request failed');
        }
        return data.result;
    } catch (error) {
        console.error('TON Center API Error:', error);
        throw error;
    }
};

export const getWalletInfo = async (address: string): Promise<WalletInfo> => {
    try {
        // Parse the address
        const parsedAddress = Address.parse(address);
        
        // Get account state using TonClient
        const accountState = await tonClient.getBalance(parsedAddress);
        const balance = fromNano(accountState.toString());
        
        // Convert to user-friendly testnet non-bounceable address
        const userFriendlyAddress = convertToTestnetAddress(address);

        console.log('Account State:', accountState);
        console.log('Balance:', balance);

        return {
            balance: Number(balance).toFixed(4),
            wallet_type: 'w5',
            user_friendly_address: userFriendlyAddress
        };
    } catch (error) {
        console.error('Error getting wallet info:', error);
        return {
            balance: '0.0000',
            wallet_type: 'unknown',
            user_friendly_address: address
        };
    }
};

const convertToTestnetAddress = (address: string): string => {
    try {
        if (!address.startsWith('0:')) return address;

        // Remove '0:' prefix and get the hex part
        const hexPart = address.slice(2);
        
        // Create buffer with address data
        const buffer = Buffer.alloc(36);
        buffer[0] = 0x11; // Non-bounceable address
        buffer[1] = 0x00; // Testnet flag
        buffer[2] = 0x00; // Workchain (0)
        Buffer.from(hexPart, 'hex').copy(buffer, 3);
        
        // Calculate checksum
        const checksum = crc16(buffer.slice(0, 34));
        buffer.writeUInt16BE(checksum, 34);
        
        // Convert to base64 and make URL safe
        const base64 = buffer.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return base64;
    } catch (error) {
        console.error('Error converting address:', error);
        return address;
    }
};
