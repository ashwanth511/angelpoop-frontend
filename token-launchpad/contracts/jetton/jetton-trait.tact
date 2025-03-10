import "@stdlib/ownable";

import "../common/traits";
import "../common/messages";
import "../common/errcodes";

import "./errcodes";
import "./messages";


// =====================================
// Traits
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
// =====================================

@interface("org.ton.jetton.master")
trait JettonMaster with Common {
    owner: Address;
    staticTax: Int;
    lockedValue: Int;

    content: Cell;
    totalSupply: Int;
    mintable: Bool;

    // this is a non-standard method, it's used to mint new tokens to specified user.
    receive(msg: MintJetton) {
        self.receiveMintJetton(msg);
    }

    // this is a non-standard method, it's used to mint new tokens to multiple users.
    receive(msg: MultiMint) {
        self.receiveMultiMint(msg);
    }

    // this is a TEP-074 standard receiver method,
    // it's used to update the jetton total supply when burning tokens.
    receive(msg: TokenBurnNotification) {
        self.receiveBurnInternal(msg);
    }

    // this is a TEP-89 standard receiver method,
    // it's used to provide the wallet address of the specified owner.
    receive(msg: ProvideWalletAddress) {
        self.receiveProvideWalletAddress(msg);
    }

    // this is a TEP-074 standard getter method
    get fun get_jetton_data(): JettonMasterData {
        return self.getJettonData();
    }

    // this is a TEP-074 standard getter method,
    // generate the jetton wallet address for any user.
    get fun get_wallet_address(owner: Address): Address {
        return self.getWalletAddress(owner);
    }

    virtual fun getWalletAddress(owner: Address): Address {
        return contractAddress(self.getJettonWalletContract(owner));
    }

    virtual fun receiveProvideWalletAddress(msg: ProvideWalletAddress) {
        let walletAddr = self.get_wallet_address(msg.ownerAddress);

        self.reserveValue(0);
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: TakeWalletAddress{
                queryId: msg.queryId,
                walletAddress: walletAddr,
                ownerAddress: msg.includeAddress ? msg.ownerAddress : null,
            }.toCell(),
        });
    }

    virtual fun getJettonWalletContract(owner: Address): StateInit {
        return initOf JettonWalletTemplate(myAddress(), owner);
    }

    virtual fun receiveBurnInternal(msg: TokenBurnNotification) {
        let ctx: Context = context();
        nativeThrowUnless(codeJettonBalanceInsufficient, self.totalSupply >= msg.amount);

        let walletAddr = self.get_wallet_address(msg.sender);
        nativeThrowUnless(codeUnauthorized, sender() == walletAddr);

        self.totalSupply -= msg.amount;

        // refund the excess TON to the sender.
        self.reserveValue(0);
        send(SendParameters{
            to: msg.responseDestination,
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: Excesses{
                queryId: msg.queryId,
            }.toCell(),
        });
    }

    virtual fun receiveMintJetton(msg: MintJetton) {
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeNotMintable, self.mintable);
        nativeThrowUnless(codeAmountShouldBePositive, msg.amount > 0);
        nativeThrowUnless(codeInflowValueNotSufficient,
            ctx.value >= msg.forwardAmount + self.staticTax);

        self.totalSupply += msg.amount;
        let jettonWallet = self.getJettonWalletContract(msg.receiver);

        // deploy the wallet if it's not deployed yet,
        // then send the minted tokens to the wallet.
        self.reserveValue(0);
        send(SendParameters{
            to: contractAddress(jettonWallet),
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: sender(),
                responseDestination: msg.responseDestination,
                forwardAmount: msg.forwardAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            code: jettonWallet.code,
            data: jettonWallet.data
        });
    }

    virtual fun receiveMultiMint(msg: MultiMint) {
        let ctx: Context = context();
        nativeThrowUnless(codeNotMintable, self.mintable);
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);

        let totalTonCost: Int = 0;
        let i: Int = 0;
        while (i < msg.receiverCount) {
            let receiver = msg.receivers.get(i);
            nativeThrowUnless(codeMapIndexNotExists, receiver != null);
            nativeThrowUnless(codeAmountShouldBePositive, receiver!!.amount > 0);
            nativeThrowUnless(codeAmountShouldBePositive, receiver!!.tonAmount > 0);
            nativeThrowUnless(codeReceiverInsufficientReceiverTonAmount,
                receiver!!.tonAmount > receiver!!.forwardAmount);

            self.totalSupply += receiver!!.amount;
            totalTonCost += receiver!!.tonAmount;

            let jettonWallet = self.getJettonWalletContract(receiver!!.receiver);
            send(SendParameters{
                to: contractAddress(jettonWallet),
                value: receiver!!.tonAmount,
                bounce: false,
                body: TokenTransferInternal{
                    queryId: msg.queryId,
                    amount: receiver!!.amount,
                    from: sender(),
                    responseDestination: receiver!!.responseDestination,
                    forwardAmount: receiver!!.forwardAmount,
                    forwardPayload: receiver!!.forwardPayload,
                }.toCell(),
                code: jettonWallet.code,
                data: jettonWallet.data
            });

            i = i + 1;
        }

        nativeThrowUnless(codeInflowValueNotSufficient,
            ctx.value >= totalTonCost + self.staticTax);

        // refund
        self.reserveValue(0);
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: Excesses{
                queryId: msg.queryId,
            }.toCell(),
        });
    }

    virtual fun getJettonData(): JettonMasterData {
        return JettonMasterData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: self.getJettonWalletContract(myAddress()).code
        };
    }
}

@interface("org.ton.jetton.wallet")
trait JettonWallet with Common {
    // owner is the address of the user who owns the wallet.
    owner: Address;
    // master is the address of the master contract that deployed this wallet.
    master: Address;
    // balance is the number of tokens that the wallet currently holds.
    // unlike the centralized ledger of Ethereum Tokens,
    // TON users keep track of the number of tokens they own in their own wallets.
    balance: Int;
    // staticTax is the fee that will be charged for each transaction.
    staticTax: Int;
    lockedValue: Int;

    // this is a TEP-074 standard receiver method,
    // owner can transfer tokens to another jetton wallet
    // by sending TokenTransfer message to the contract.
    receive(msg: TokenTransfer) {
        self.receiveTokenTransfer(msg);
    }

    // this is unspecified by standard, but suggested format of internal message.
    // receive tokens from another jetton wallet
    receive(msg: TokenTransferInternal) {
        self.receiveTokenTransferInternal(msg);
    }

    // this is a TEP-074 standard receiver method
    receive(msg: Burn) {
        self.receiveBurn(msg);
    }

    // this is a TEP-074 standard getter method
    get fun get_wallet_data(): JettonWalletData {
        return self.getWalletData();
    }

    bounced(src: bounced<TokenTransferInternal>) {
        self.balance += src.amount;
    }

    bounced(src: bounced<TokenBurnNotification>) {
        self.balance += src.amount;
    }

    virtual fun getJettonWalletContract(owner: Address): StateInit {
        return initOf JettonWalletTemplate(self.master, owner);
    }

    virtual fun receiveTokenTransfer(msg: TokenTransfer) {
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeJettonBalanceInsufficient, self.balance >= msg.amount);
        nativeThrowUnless(codeAmountShouldBePositive, msg.amount > 0);
        nativeThrowUnless(codeInflowValueNotSufficient,
            ctx.value >= msg.forwardAmount + self.staticTax);

        self.balance -= msg.amount;

        let destJettonContract = self.getJettonWalletContract(msg.destination);

        // deploy the wallet if it's not deployed yet,
        // then transfer the tokens to the wallet.
        self.reserveValue(0);
        send(SendParameters{
            to: contractAddress(destJettonContract),
            value: 0,
            mode: SendRemainingBalance,
            // amount could be negative, it is impossible to pre-confirm whether
            // the receiver has enough balance to cover the negative amount,
            // which means the transfer may fail. If that happens,
            // the contract's balance must be adjusted using a bounced message.
            bounce: true,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                responseDestination: msg.responseDestination,
                forwardAmount: msg.forwardAmount,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: destJettonContract.code,
            data: destJettonContract.data
        });
    }

    virtual fun receiveTokenTransferInternal(msg: TokenTransferInternal){
        let ctx: Context = context();
        nativeThrowUnless(codeAmountShouldBePositive, msg.amount > 0);
        nativeThrowUnless(codeInflowValueNotSufficient,
            ctx.value > msg.forwardAmount + self.staticTax);

        // only the owner or another jetton wallet can send TokenTransferInternal
        if (ctx.sender != self.master) {
            let peerJettonContractAddr = contractAddress(self.getJettonWalletContract(msg.from));
            nativeThrowUnless(codeUnauthorized, ctx.sender == peerJettonContractAddr);
        }

        // Update balance
        self.balance += msg.amount;

        // https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
        // if forward_amount > 0 ensure that receiver's jetton-wallet
        // send message to destination address, which means the new owner of the token
        if (msg.forwardAmount > 0) {
            send(SendParameters{
                to: self.owner,
                value: msg.forwardAmount,
                bounce: false,
                mode: SendIgnoreErrors,
                body: TransferNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.from,
                    forwardPayload: msg.forwardPayload
                }.toCell()
            });
        }

        // refund the excess TON to the sender.
        //
        // using the SendRemainingBalance mode will transfer all balances
        // that are not locked by nativeReserve.
        // https://docs.tact-lang.org/ref/core-advanced#nativereserve
        self.reserveValue(0);
        send(SendParameters{
            to: msg.responseDestination,
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: Excesses{queryId: msg.queryId}.toCell(),
        });
    }

    virtual fun receiveBurn(msg: Burn) {
        dump("555");
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        dump("556");

        nativeThrowUnless(codeBalanceNotSufficient, self.balance >= msg.amount);
        nativeThrowUnless(codeAmountShouldBePositive, msg.amount > 0);


        // Update balance
        self.balance -= msg.amount;

        // notify master to update totalSupply
        self.reserveValue(0);
        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingBalance,
            bounce: true,
            body: TokenBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    virtual fun getWalletData(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: self.getJettonWalletContract(self.owner).code,
        };
    }
}
