import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import '@ton/test-utils';
import { JettonFactory } from '../wrappers/JettonFactory';
import { JettonMasterTemplate } from '../build/JettonFactory/tact_JettonMasterTemplate';
import { JettonWalletTemplate } from '../build/JettonFactory/tact_JettonWalletTemplate';

const jettonIpfsURL =
    'https://aqua-surprised-owl-633.mypinata.cloud/ipfs/bafkreidb35nhf2xr7jp3xbbonqhh3dqaxnq4cczfisdrpv26o4pmg4zpv4';

const jettonContent = {
    $$type: 'Tep64TokenData' as const,
    flag: BigInt(1),
    content: jettonIpfsURL,
};

describe('JettonMaster', () => {
    let blockchain: Blockchain;

    let admin: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;

    let jettonFactoryContract: SandboxContract<JettonFactory>;
    let jettoMasterContract: SandboxContract<JettonMasterTemplate>;
    let jettonWalletContract: SandboxContract<JettonWalletTemplate>;

    let userJettonWalletContract: SandboxContract<JettonWalletTemplate>;

    let initialTokens = toNano('1');
    let maxTokenSupply = 1000n * initialTokens;
    let initialPrice = toNano(1);

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        admin = await blockchain.treasury('admin');
        user = await blockchain.treasury('user');

        jettonFactoryContract = blockchain.openContract(await JettonFactory.fromInit(admin.address, 0n));
        jettoMasterContract = blockchain.openContract(
            await JettonMasterTemplate.fromInit(
                jettonFactoryContract.address,
                initialTokens,
                maxTokenSupply,
                initialPrice,
                jettonContent,
            ),
        );
        jettonWalletContract = blockchain.openContract(
            await JettonWalletTemplate.fromInit(jettoMasterContract.address, admin.address),
        );

        userJettonWalletContract = blockchain.openContract(
            await JettonWalletTemplate.fromInit(jettoMasterContract.address, user.address),
        );
    });

    it('should deploy jetton factory', async () => {
        const tx = await jettonFactoryContract.send(
            admin.getSender(),
            {
                value: toNano(1),
                bounce: false,
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(tx.transactions).toHaveTransaction({
            from: admin.address,
            to: jettonFactoryContract.address,
            success: true,
        });
    });

    it('it should launch a token', async () => {
        const tx = await jettonFactoryContract.send(
            admin.getSender(),
            {
                value: toNano(1),
                bounce: false,
            },
            {
                $$type: 'LaunchToken',
                content: jettonContent,
            },
        );

        expect(tx.transactions).toHaveTransaction({
            from: admin.address,
            to: jettonFactoryContract.address,
            success: true,
        });
    });

    it(`total jetton supply should be ${initialTokens}`, async () => {
        const jettonData = await jettoMasterContract.getGetJettonData();
        expect(jettonData.totalSupply).toEqual(initialTokens);
    });

    it(`total jetton factory should have ${initialTokens}`, async () => {
        const jettonWalletData = await jettonWalletContract.getGetWalletData();
        expect(jettonWalletData.balance).toEqual(initialTokens);
    });

    it(`initial token price should be ${initialPrice}`, async () => {
        const tokenPrice = await jettoMasterContract.getCurrentPrice();
        expect(tokenPrice).toEqual(initialPrice);
    });

    it('should buy tokens', async () => {
        const tonAmount = 4;
        const tx = await jettonFactoryContract.send(
            user.getSender(),
            {
                value: toNano(tonAmount),
                bounce: false,
            },
            {
                $$type: 'BuyFromPool',
                jettonMasterAddress: jettoMasterContract.address,
            },
        );

        expect(tx.transactions).toHaveTransaction({
            to: jettonFactoryContract.address,
            from: user.address,
            success: true,
        });

        const jettonData = await jettoMasterContract.getGetJettonData();

        const userJettonWalletData = await userJettonWalletContract.getGetWalletData();
        console.log(
            'jettonData.totalSupply',
            jettonData.totalSupply,
            'userJettonWalletData',
            userJettonWalletData.balance,
        );

        // const tonBalance = await jettoMasterContract.getTonBalance();
        // expect(jettonData.totalSupply).toEqual(initialTokens + BigInt(tonAmount) * initialPrice);
    });

    it('sell token', async () => {
        const tx = await jettonFactoryContract.send(
            user.getSender(),
            {
                value: toNano(1),
                bounce: false,
            },
            {
                $$type: 'SellFromPool',
                jettonMasterAddress: jettoMasterContract.address,
                amount: toNano(1),
            },
        );

        // console.log('tx', tx);

        expect(tx.transactions).toHaveTransaction({
            to: jettonFactoryContract.address,
            from: user.address,
            success: true,
        });

        const userJettonWalletData = await userJettonWalletContract.getGetWalletData();
        console.log('userJettonWalletData', userJettonWalletData.balance);
        const tonBalance = await jettoMasterContract.getTonBalance();
        console.log('tonBalance', tonBalance);
        console.log('user', userJettonWalletContract.address);
    });
});
