import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "../jetton/jetton";
import "../jetton/messages";

const INITIAL_TOKEN_MINT: Int = ton("1");
const MAX_SUPPLY: Int = 1000 * INITIAL_TOKEN_MINT;
const INITIAL_PRICE: Int = ton("1");

contract JettonFactory with Deployable, OwnableTransferable {
    owner: Address;
    seqNo: Int;

    init(owner: Address, seqNo: Int) {
        self.owner = owner;
        self.seqNo = seqNo;
    }

    receive(msg: LaunchToken) {
        let init: StateInit = initOf JettonMasterTemplate(myAddress(),INITIAL_TOKEN_MINT, MAX_SUPPLY, INITIAL_PRICE, msg.content);

        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            mode: SendRemainingValue,
            code: init.code,
            data: init.data,
            body: MintJetton{
                    queryId: 100, // TODO: Remove hardcoded
                    amount: INITIAL_TOKEN_MINT,
                    receiver: sender(),
                    responseDestination: sender(),
                    forwardAmount: ton("0.1"),
                    forwardPayload: "jetton forward msg".asComment(),
            }.toCell()
        })
    }

    receive(msg: BuyFromPool) {
        send(SendParameters{
            to: msg.jettonMasterAddress,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: BuyToken{
                receiverAddress: sender(),
                jettonMasterAddress: msg.jettonMasterAddress,
            }.toCell()
        })
    }

    receive(msg: SellFromPool) {
        send(SendParameters{
            to: msg.jettonMasterAddress,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: SellToken{
                receiverAddress: sender(),
                jettonAmount: msg.amount
            }.toCell()
        })
    }
}
