message LaunchToken {
    content: Tep64TokenData;
}

message BuyFromPool {
    jettonMasterAddress: Address
}

message SellFromPool {
    jettonMasterAddress: Address;
    amount: Int as coins;
}
