// =====================================
// TEP-74: Standard Jettom messages
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
// =====================================

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    // the amount of jettons to transfer
    amount: Int as coins;
    // the address of the jetton receiver
    destination: Address;
    // the address to send the excesses to
    responseDestination: Address;
    // the custom payload to be sent with the excesses
    customPayload: Cell?;
    // the amount of TON coins to forward,
    // if not zero, will send additional msg with the specified amount
    forwardAmount: Int as coins;
    // the payload to forward
    forwardPayload: Cell?;
}
// transfer tokens between jetton wallets or master contract
message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    responseDestination: Address;
    forwardAmount: Int as coins;
    forwardPayload: Cell?;
}
message(0x7362d09c) TransferNotification {
    queryId: Int as uint64;
    // the amount of jettons transferred
    amount: Int as coins;
    // the address of the jetton sender
    sender: Address;
    forwardPayload: Cell?;
}
message(0x595f07bc) Burn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}
message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address;
}
message(0xd53276db) Excesses {
    queryId: Int as uint64;
}
// -------------------------------------
// TEP-89: Discoverable Jettons Wallets
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
// -------------------------------------

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}
message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    // if it is not possible to generate wallet address
    // for address in question (for instance wrong workchain)
    // wallet_address in take_wallet_address
    // should be equal to addr_none
    walletAddress: Address;
    // If include_address is set to True,
    // take_wallet_address should include
    // owner_address equal to owner_address in request
    ownerAddress: Address?;
}
// -------------------------------------
// TEP-62: NFT standard messages
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
// -------------------------------------

message(0x693d3950) GetRoyaltyParams {
    queryId: Int as uint64;
}
message(0xa8cb00ad) ReportRoyaltyParams {
    queryId: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as coins;
    destination: Address;
}
// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer
message(0x5fcc3d14) NFTTransfer {
    queryId: Int as uint64;
    // newOwner is address of the new owner of the NFT item.
    newOwner: Address;
    // responseDestination is the address where to send a response
    // with confirmation of a successful transfer and the rest of
    // the incoming message coins.
    responseDestination: Address;
    // customPayload is the optional custom data.
    customPayload: Cell?;
    // forwardAmount is the amount of nanotons to be sent to the new owner.
    forwardAmount: Int as coins;
    // forwardPayload is the optional custom data that should be
    // sent to the new owner.
    forwardPayload: Cell?;
}
message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Cell?;
}
message(0x2fcb26a2) GetStaticData {
    queryId: Int as uint64;
}
message(0x8b771735) ReportStaticData {
    queryId: Int as uint64;
    index: Int as uint256;
    collection: Address;
}
struct GetNftData {
    init: Bool;
    index: Int as uint256;
    collectionAddress: Address;
    ownerAddress: Address;
    individualContent: Cell;
}
struct CollectionData {
    nextItemIndex: Int;
    collectionContent: Cell;
    ownerAddress: Address;
}
// https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md#get-methods
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#content-representation
struct Tep64TokenData {
    // flag is the flag of the content type.
    // 0 means on-chain, 1 means off-chain.
    flag: Int as uint8;
    content: String;
}
// -------------------------------------
// Custom messages
// -------------------------------------

// SetStaticTax is the message that used to set the static tax fee.
message(0x1509a420) SetStaticTax {
    staticTax: Int as coins;
}
message(0x112a9509) UpgradeContract {
    queryId: Int;
    code: Cell?;
    data: Cell?;
    responseDestination: Address;
}
struct MerkleProof {
    data: Cell;
    root: Int as uint256;
    proof: map<Int as uint32, Int as uint256>;
    proofLen: Int as uint32;
}
