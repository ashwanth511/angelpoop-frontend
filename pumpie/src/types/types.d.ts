export interface Transaction {
    hash: string;
    time: number; // Assuming time is a UNIX timestamp
    from: string;
    to: string;
    amount: string;
    fee: string;
}

export interface TokenData {
    _id: string;
    name: string;
    symbol: string;
    description: string;
    agentType: string;
    creatorAddress: string;
    imageUrl: string;
    networkType: string;
    totalSupply: string;
    decimals: number;
    price: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
    totalValueLocked: number;
    holders: number;
    tokenAddress: string;
    inPool: boolean;
    projectDescription: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    poolAddress: string;
    liquidityProgress: number;
    website?: string;
    telegram?: string;
    twitter?: string;
    initialLiquidity?: string;
}
