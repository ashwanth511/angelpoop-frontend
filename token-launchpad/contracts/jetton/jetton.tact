import "./jetton-trait";
import "../common/math";
import "./messages";
import "../common/messages";
// import "../common/traits";

contract JettonMasterTemplate with JettonMaster {
    owner: Address;
    staticTax: Int as coins = ton("0.001");
    lockedValue: Int as coins = 0;

    // Cell to store arbitrary data related to the jetton
    //
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain
    content: Cell;
    // Total number of tokens in existence.
    totalSupply: Int as coins;
    max_supply: Int as coins;
    initial_price: Int as coins;
    curve_steepness: Int;
    base_amount: Int as coins;
    // pool: Address;

    mintable: Bool;

    init(owner: Address, initial_token: Int, max_supply: Int, initial_price: Int, content: Tep64TokenData) {
        self.owner = owner;
        self.content = content.toCell();
        self.totalSupply = 0;
        self.max_supply = max_supply;
        self.initial_price = initial_price;
        self.mintable = true;
        self.curve_steepness = 1;
        self.base_amount = initial_token;
    }

    receive(msg: BuyToken) {
        let receiverAddress = msg.receiverAddress;
        let tonValue = context().value;

        // Ensure minimum gas for operation
        require(tonValue >= ton("0.1"), "insufficient TON received");

        // calculate amount of jettons to mint based on current price
        let gas = ton("0.6"); // Reserve gas for operation
        let purchase_amount = tonValue - gas;
        let current_price = self.currentPrice();
   
        let sqrt_part = sqrt(pow(current_price,2) + (2 * self.curve_steepness * purchase_amount));
        let tokens_to_mint = (sqrt_part - current_price) / self.curve_steepness;

        require((self.totalSupply + (tokens_to_mint * 1000000000)) <= self.max_supply, "Exceeds max supply");

        nativeReserve(purchase_amount, ReserveExact);
        self.receiveMintJetton(
            MintJetton{
                queryId: 100, // TODO: Remove hardcoded
                amount: (tokens_to_mint * 1000000000), // * 10^9
                receiver: receiverAddress,
                responseDestination: receiverAddress,
                forwardAmount: ton("0.2"),
                forwardPayload:emptyCell(),
            }
        )
        
    }

    receive(msg: SellToken) {
        require(msg.jettonAmount > 0, "Invalid token amount");

        let amount = msg.jettonAmount;

        // Get sender's jetton wallet address
        let sender_address: Address = msg.receiverAddress;
        let initCode: StateInit = self.calculate_jetton_wallet_init(sender_address);
        let jettonWallet: Address = contractAddress(initCode);

        let current_price: Int = self.currentPrice();

        let totalRefund = (amount * current_price) - (self.curve_steepness * ((amount * (amount - 1)) / 2));

        totalRefund = totalRefund/1000000000;

        require(myBalance() >= totalRefund, "Insufficient contract balance");
        dump(totalRefund);

        send(SendParameters{
            to: jettonWallet,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: Burn{
                queryId: 0,
                amount: ton("1"),
                responseDestination: myAddress(),
                customPayload: null,
            }.toCell()
        });
    }

    get fun currentPrice(): Int {
        let n: Int = self.totalSupply - self.base_amount;  // Tokens sold after initial mint
        return self.initial_price + (self.curve_steepness * n);
    }

    fun calculate_jetton_wallet_init(owner_address: Address): StateInit {
        return initOf JettonWalletTemplate(myAddress(),owner_address);
    }
}

contract JettonWalletTemplate with JettonWallet {
    // owner is the address of the user who owns the wallet.
    owner: Address;
    // master is the address of the master contract that deployed this wallet.
    master: Address;
    // balance is the number of tokens that the wallet currently holds.
    // unlike the centralized ledger of Ethereum Tokens,
    // TON users keep track of the number of tokens they own in their own wallets.
    balance: Int;
    // staticTax is the fee that will be charged for each transaction.
    staticTax: Int as coins = ton("0.001");
    lockedValue: Int as coins = 0;

    // The parameters of the init function should not be too complex,
    // as it will be called frequently when generating the jetton wallet address.
    init(master: Address, owner: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }
}
