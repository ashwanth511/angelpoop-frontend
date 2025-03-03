import { TonClient } from '@ton/ton';
import { CURRENT_NETWORK } from '../config/contracts';

let tonClient: TonClient | null = null;

export function getTonClient(): TonClient {
    if (!tonClient) {
        tonClient = new TonClient({
            endpoint: CURRENT_NETWORK.ENDPOINT,
            apiKey: CURRENT_NETWORK.API_KEY,
        });
    }
    return tonClient;
}

export function getExplorerLink(address: string): string {
    return `${CURRENT_NETWORK.EXPLORER}/address/${address}`;
}
