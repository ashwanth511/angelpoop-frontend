import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type JettonMint = {
    $$type: 'JettonMint';
    origin: Address;
    receiver: Address;
    amount: bigint;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeJettonMint(src: JettonMint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2310479113, 32);
        b_0.storeAddress(src.origin);
        b_0.storeAddress(src.receiver);
        b_0.storeInt(src.amount, 257);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2310479113) { throw Error('Invalid prefix'); }
    let _origin = sc_0.loadAddress();
    let _receiver = sc_0.loadAddress();
    let _amount = sc_0.loadIntBig(257);
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'JettonMint' as const, origin: _origin, receiver: _receiver, amount: _amount, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleJettonMint(source: TupleReader) {
    let _origin = source.readAddress();
    let _receiver = source.readAddress();
    let _amount = source.readBigNumber();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonMint' as const, origin: _origin, receiver: _receiver, amount: _amount, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadGetterTupleJettonMint(source: TupleReader) {
    let _origin = source.readAddress();
    let _receiver = source.readAddress();
    let _amount = source.readBigNumber();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonMint' as const, origin: _origin, receiver: _receiver, amount: _amount, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleJettonMint(source: JettonMint) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.origin);
    builder.writeAddress(source.receiver);
    builder.writeNumber(source.amount);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserJettonMint(): DictionaryValue<JettonMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonMint(src)).endCell());
        },
        parse: (src) => {
            return loadJettonMint(src.loadRef().beginParse());
        }
    }
}

export type JettonData = {
    $$type: 'JettonData';
    total_supply: bigint;
    mintable: boolean;
    admin_address: Address;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
}

export function storeJettonData(src: JettonData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.total_supply, 257);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.admin_address);
        b_0.storeRef(src.jetton_content);
        b_0.storeRef(src.jetton_wallet_code);
    };
}

export function loadJettonData(slice: Slice) {
    let sc_0 = slice;
    let _total_supply = sc_0.loadIntBig(257);
    let _mintable = sc_0.loadBit();
    let _admin_address = sc_0.loadAddress();
    let _jetton_content = sc_0.loadRef();
    let _jetton_wallet_code = sc_0.loadRef();
    return { $$type: 'JettonData' as const, total_supply: _total_supply, mintable: _mintable, admin_address: _admin_address, jetton_content: _jetton_content, jetton_wallet_code: _jetton_wallet_code };
}

function loadTupleJettonData(source: TupleReader) {
    let _total_supply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _admin_address = source.readAddress();
    let _jetton_content = source.readCell();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'JettonData' as const, total_supply: _total_supply, mintable: _mintable, admin_address: _admin_address, jetton_content: _jetton_content, jetton_wallet_code: _jetton_wallet_code };
}

function loadGetterTupleJettonData(source: TupleReader) {
    let _total_supply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _admin_address = source.readAddress();
    let _jetton_content = source.readCell();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'JettonData' as const, total_supply: _total_supply, mintable: _mintable, admin_address: _admin_address, jetton_content: _jetton_content, jetton_wallet_code: _jetton_wallet_code };
}

function storeTupleJettonData(source: JettonData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.total_supply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.admin_address);
    builder.writeCell(source.jetton_content);
    builder.writeCell(source.jetton_wallet_code);
    return builder.build();
}

function dictValueParserJettonData(): DictionaryValue<JettonData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonData(src.loadRef().beginParse());
        }
    }
}

export type JettonTransfer = {
    $$type: 'JettonTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeJettonTransfer(src: JettonTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'JettonTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleJettonTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadGetterTupleJettonTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleJettonTransfer(source: JettonTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserJettonTransfer(): DictionaryValue<JettonTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransfer(src.loadRef().beginParse());
        }
    }
}

export type JettonTransferNotification = {
    $$type: 'JettonTransferNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    forward_payload: Slice;
}

export function storeJettonTransferNotification(src: JettonTransferNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonTransferNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _forward_payload = sc_0;
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

function loadTupleJettonTransferNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

function loadGetterTupleJettonTransferNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

function storeTupleJettonTransferNotification(source: JettonTransferNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserJettonTransferNotification(): DictionaryValue<JettonTransferNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransferNotification(src.loadRef().beginParse());
        }
    }
}

export type JettonBurn = {
    $$type: 'JettonBurn';
    query_id: bigint;
    amount: bigint;
    response_destination: Address;
    custom_payload: Cell | null;
}

export function storeJettonBurn(src: JettonBurn) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
    };
}

export function loadJettonBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'JettonBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function loadTupleJettonBurn(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    return { $$type: 'JettonBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function loadGetterTupleJettonBurn(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    return { $$type: 'JettonBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function storeTupleJettonBurn(source: JettonBurn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    return builder.build();
}

function dictValueParserJettonBurn(): DictionaryValue<JettonBurn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonBurn(src)).endCell());
        },
        parse: (src) => {
            return loadJettonBurn(src.loadRef().beginParse());
        }
    }
}

export type JettonExcesses = {
    $$type: 'JettonExcesses';
    query_id: bigint;
}

export function storeJettonExcesses(src: JettonExcesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadJettonExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'JettonExcesses' as const, query_id: _query_id };
}

function loadTupleJettonExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'JettonExcesses' as const, query_id: _query_id };
}

function loadGetterTupleJettonExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'JettonExcesses' as const, query_id: _query_id };
}

function storeTupleJettonExcesses(source: JettonExcesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserJettonExcesses(): DictionaryValue<JettonExcesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadJettonExcesses(src.loadRef().beginParse());
        }
    }
}

export type JettonInternalTransfer = {
    $$type: 'JettonInternalTransfer';
    query_id: bigint;
    amount: bigint;
    from: Address;
    response_address: Address | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeJettonInternalTransfer(src: JettonInternalTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.response_address);
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonInternalTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _response_address = sc_0.loadMaybeAddress();
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'JettonInternalTransfer' as const, query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleJettonInternalTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_address = source.readAddressOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonInternalTransfer' as const, query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadGetterTupleJettonInternalTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_address = source.readAddressOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonInternalTransfer' as const, query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleJettonInternalTransfer(source: JettonInternalTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.response_address);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserJettonInternalTransfer(): DictionaryValue<JettonInternalTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonInternalTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonInternalTransfer(src.loadRef().beginParse());
        }
    }
}

export type JettonBurnNotification = {
    $$type: 'JettonBurnNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    response_destination: Address;
}

export function storeJettonBurnNotification(src: JettonBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadJettonBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    return { $$type: 'JettonBurnNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}

function loadTupleJettonBurnNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _response_destination = source.readAddress();
    return { $$type: 'JettonBurnNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}

function loadGetterTupleJettonBurnNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _response_destination = source.readAddress();
    return { $$type: 'JettonBurnNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}

function storeTupleJettonBurnNotification(source: JettonBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserJettonBurnNotification(): DictionaryValue<JettonBurnNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type WalletData = {
    $$type: 'WalletData';
    balance: bigint;
    owner: Address;
    jetton: Address;
    jetton_wallet_code: Cell;
}

export function storeWalletData(src: WalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jetton);
        b_0.storeRef(src.jetton_wallet_code);
    };
}

export function loadWalletData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _jetton = sc_0.loadAddress();
    let _jetton_wallet_code = sc_0.loadRef();
    return { $$type: 'WalletData' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function loadTupleWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton = source.readAddress();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'WalletData' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function loadGetterTupleWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton = source.readAddress();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'WalletData' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function storeTupleWalletData(source: WalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.jetton);
    builder.writeCell(source.jetton_wallet_code);
    return builder.build();
}

function dictValueParserWalletData(): DictionaryValue<WalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadWalletData(src.loadRef().beginParse());
        }
    }
}

export type RegisterToken = {
    $$type: 'RegisterToken';
    tokenAddress: Address;
}

export function storeRegisterToken(src: RegisterToken) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(394751612, 32);
        b_0.storeAddress(src.tokenAddress);
    };
}

export function loadRegisterToken(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 394751612) { throw Error('Invalid prefix'); }
    let _tokenAddress = sc_0.loadAddress();
    return { $$type: 'RegisterToken' as const, tokenAddress: _tokenAddress };
}

function loadTupleRegisterToken(source: TupleReader) {
    let _tokenAddress = source.readAddress();
    return { $$type: 'RegisterToken' as const, tokenAddress: _tokenAddress };
}

function loadGetterTupleRegisterToken(source: TupleReader) {
    let _tokenAddress = source.readAddress();
    return { $$type: 'RegisterToken' as const, tokenAddress: _tokenAddress };
}

function storeTupleRegisterToken(source: RegisterToken) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.tokenAddress);
    return builder.build();
}

function dictValueParserRegisterToken(): DictionaryValue<RegisterToken> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRegisterToken(src)).endCell());
        },
        parse: (src) => {
            return loadRegisterToken(src.loadRef().beginParse());
        }
    }
}

export type VerifyJetton = {
    $$type: 'VerifyJetton';
    queryId: bigint;
    tokenAddress: Address;
}

export function storeVerifyJetton(src: VerifyJetton) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1099595772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.tokenAddress);
    };
}

export function loadVerifyJetton(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1099595772) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _tokenAddress = sc_0.loadAddress();
    return { $$type: 'VerifyJetton' as const, queryId: _queryId, tokenAddress: _tokenAddress };
}

function loadTupleVerifyJetton(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _tokenAddress = source.readAddress();
    return { $$type: 'VerifyJetton' as const, queryId: _queryId, tokenAddress: _tokenAddress };
}

function loadGetterTupleVerifyJetton(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _tokenAddress = source.readAddress();
    return { $$type: 'VerifyJetton' as const, queryId: _queryId, tokenAddress: _tokenAddress };
}

function storeTupleVerifyJetton(source: VerifyJetton) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.tokenAddress);
    return builder.build();
}

function dictValueParserVerifyJetton(): DictionaryValue<VerifyJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVerifyJetton(src)).endCell());
        },
        parse: (src) => {
            return loadVerifyJetton(src.loadRef().beginParse());
        }
    }
}

export type JettonVerified = {
    $$type: 'JettonVerified';
    queryId: bigint;
    isJetton: boolean;
    tokenAddress: Address;
}

export function storeJettonVerified(src: JettonVerified) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1309512043, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeBit(src.isJetton);
        b_0.storeAddress(src.tokenAddress);
    };
}

export function loadJettonVerified(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1309512043) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _isJetton = sc_0.loadBit();
    let _tokenAddress = sc_0.loadAddress();
    return { $$type: 'JettonVerified' as const, queryId: _queryId, isJetton: _isJetton, tokenAddress: _tokenAddress };
}

function loadTupleJettonVerified(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _isJetton = source.readBoolean();
    let _tokenAddress = source.readAddress();
    return { $$type: 'JettonVerified' as const, queryId: _queryId, isJetton: _isJetton, tokenAddress: _tokenAddress };
}

function loadGetterTupleJettonVerified(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _isJetton = source.readBoolean();
    let _tokenAddress = source.readAddress();
    return { $$type: 'JettonVerified' as const, queryId: _queryId, isJetton: _isJetton, tokenAddress: _tokenAddress };
}

function storeTupleJettonVerified(source: JettonVerified) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.isJetton);
    builder.writeAddress(source.tokenAddress);
    return builder.build();
}

function dictValueParserJettonVerified(): DictionaryValue<JettonVerified> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonVerified(src)).endCell());
        },
        parse: (src) => {
            return loadJettonVerified(src.loadRef().beginParse());
        }
    }
}

export type BuyTokens = {
    $$type: 'BuyTokens';
    resAddress: Address;
    tonAmount: bigint;
}

export function storeBuyTokens(src: BuyTokens) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(820359839, 32);
        b_0.storeAddress(src.resAddress);
        b_0.storeInt(src.tonAmount, 257);
    };
}

export function loadBuyTokens(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 820359839) { throw Error('Invalid prefix'); }
    let _resAddress = sc_0.loadAddress();
    let _tonAmount = sc_0.loadIntBig(257);
    return { $$type: 'BuyTokens' as const, resAddress: _resAddress, tonAmount: _tonAmount };
}

function loadTupleBuyTokens(source: TupleReader) {
    let _resAddress = source.readAddress();
    let _tonAmount = source.readBigNumber();
    return { $$type: 'BuyTokens' as const, resAddress: _resAddress, tonAmount: _tonAmount };
}

function loadGetterTupleBuyTokens(source: TupleReader) {
    let _resAddress = source.readAddress();
    let _tonAmount = source.readBigNumber();
    return { $$type: 'BuyTokens' as const, resAddress: _resAddress, tonAmount: _tonAmount };
}

function storeTupleBuyTokens(source: BuyTokens) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.resAddress);
    builder.writeNumber(source.tonAmount);
    return builder.build();
}

function dictValueParserBuyTokens(): DictionaryValue<BuyTokens> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuyTokens(src)).endCell());
        },
        parse: (src) => {
            return loadBuyTokens(src.loadRef().beginParse());
        }
    }
}

export type SellTokens = {
    $$type: 'SellTokens';
    resAddress: Address;
    tokenAmount: bigint;
}

export function storeSellTokens(src: SellTokens) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2538899928, 32);
        b_0.storeAddress(src.resAddress);
        b_0.storeInt(src.tokenAmount, 257);
    };
}

export function loadSellTokens(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2538899928) { throw Error('Invalid prefix'); }
    let _resAddress = sc_0.loadAddress();
    let _tokenAmount = sc_0.loadIntBig(257);
    return { $$type: 'SellTokens' as const, resAddress: _resAddress, tokenAmount: _tokenAmount };
}

function loadTupleSellTokens(source: TupleReader) {
    let _resAddress = source.readAddress();
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'SellTokens' as const, resAddress: _resAddress, tokenAmount: _tokenAmount };
}

function loadGetterTupleSellTokens(source: TupleReader) {
    let _resAddress = source.readAddress();
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'SellTokens' as const, resAddress: _resAddress, tokenAmount: _tokenAmount };
}

function storeTupleSellTokens(source: SellTokens) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.resAddress);
    builder.writeNumber(source.tokenAmount);
    return builder.build();
}

function dictValueParserSellTokens(): DictionaryValue<SellTokens> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSellTokens(src)).endCell());
        },
        parse: (src) => {
            return loadSellTokens(src.loadRef().beginParse());
        }
    }
}

export type PoolBuy = {
    $$type: 'PoolBuy';
    jettonAddress: Address;
}

export function storePoolBuy(src: PoolBuy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(843028996, 32);
        b_0.storeAddress(src.jettonAddress);
    };
}

export function loadPoolBuy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 843028996) { throw Error('Invalid prefix'); }
    let _jettonAddress = sc_0.loadAddress();
    return { $$type: 'PoolBuy' as const, jettonAddress: _jettonAddress };
}

function loadTuplePoolBuy(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    return { $$type: 'PoolBuy' as const, jettonAddress: _jettonAddress };
}

function loadGetterTuplePoolBuy(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    return { $$type: 'PoolBuy' as const, jettonAddress: _jettonAddress };
}

function storeTuplePoolBuy(source: PoolBuy) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    return builder.build();
}

function dictValueParserPoolBuy(): DictionaryValue<PoolBuy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePoolBuy(src)).endCell());
        },
        parse: (src) => {
            return loadPoolBuy(src.loadRef().beginParse());
        }
    }
}

export type PoolSell = {
    $$type: 'PoolSell';
    jettonAddress: Address;
    to: Address;
    amount: bigint;
}

export function storePoolSell(src: PoolSell) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2040629039, 32);
        b_0.storeAddress(src.jettonAddress);
        b_0.storeAddress(src.to);
        b_0.storeCoins(src.amount);
    };
}

export function loadPoolSell(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2040629039) { throw Error('Invalid prefix'); }
    let _jettonAddress = sc_0.loadAddress();
    let _to = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    return { $$type: 'PoolSell' as const, jettonAddress: _jettonAddress, to: _to, amount: _amount };
}

function loadTuplePoolSell(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _to = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'PoolSell' as const, jettonAddress: _jettonAddress, to: _to, amount: _amount };
}

function loadGetterTuplePoolSell(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _to = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'PoolSell' as const, jettonAddress: _jettonAddress, to: _to, amount: _amount };
}

function storeTuplePoolSell(source: PoolSell) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeAddress(source.to);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserPoolSell(): DictionaryValue<PoolSell> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePoolSell(src)).endCell());
        },
        parse: (src) => {
            return loadPoolSell(src.loadRef().beginParse());
        }
    }
}

export type AddJetton = {
    $$type: 'AddJetton';
    jettonAddress: Address;
}

export function storeAddJetton(src: AddJetton) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1824497237, 32);
        b_0.storeAddress(src.jettonAddress);
    };
}

export function loadAddJetton(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1824497237) { throw Error('Invalid prefix'); }
    let _jettonAddress = sc_0.loadAddress();
    return { $$type: 'AddJetton' as const, jettonAddress: _jettonAddress };
}

function loadTupleAddJetton(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    return { $$type: 'AddJetton' as const, jettonAddress: _jettonAddress };
}

function loadGetterTupleAddJetton(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    return { $$type: 'AddJetton' as const, jettonAddress: _jettonAddress };
}

function storeTupleAddJetton(source: AddJetton) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    return builder.build();
}

function dictValueParserAddJetton(): DictionaryValue<AddJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddJetton(src)).endCell());
        },
        parse: (src) => {
            return loadAddJetton(src.loadRef().beginParse());
        }
    }
}

export type BuyMint = {
    $$type: 'BuyMint';
    tokenAmount: bigint;
}

export function storeBuyMint(src: BuyMint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3627142605, 32);
        b_0.storeInt(src.tokenAmount, 257);
    };
}

export function loadBuyMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3627142605) { throw Error('Invalid prefix'); }
    let _tokenAmount = sc_0.loadIntBig(257);
    return { $$type: 'BuyMint' as const, tokenAmount: _tokenAmount };
}

function loadTupleBuyMint(source: TupleReader) {
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'BuyMint' as const, tokenAmount: _tokenAmount };
}

function loadGetterTupleBuyMint(source: TupleReader) {
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'BuyMint' as const, tokenAmount: _tokenAmount };
}

function storeTupleBuyMint(source: BuyMint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.tokenAmount);
    return builder.build();
}

function dictValueParserBuyMint(): DictionaryValue<BuyMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuyMint(src)).endCell());
        },
        parse: (src) => {
            return loadBuyMint(src.loadRef().beginParse());
        }
    }
}

export type BurnNotificationWithTon = {
    $$type: 'BurnNotificationWithTon';
    amount: bigint;
    tokenAmount: bigint;
    user: Address;
}

export function storeBurnNotificationWithTon(src: BurnNotificationWithTon) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(193322806, 32);
        b_0.storeCoins(src.amount);
        b_0.storeCoins(src.tokenAmount);
        b_0.storeAddress(src.user);
    };
}

export function loadBurnNotificationWithTon(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 193322806) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    let _tokenAmount = sc_0.loadCoins();
    let _user = sc_0.loadAddress();
    return { $$type: 'BurnNotificationWithTon' as const, amount: _amount, tokenAmount: _tokenAmount, user: _user };
}

function loadTupleBurnNotificationWithTon(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _tokenAmount = source.readBigNumber();
    let _user = source.readAddress();
    return { $$type: 'BurnNotificationWithTon' as const, amount: _amount, tokenAmount: _tokenAmount, user: _user };
}

function loadGetterTupleBurnNotificationWithTon(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _tokenAmount = source.readBigNumber();
    let _user = source.readAddress();
    return { $$type: 'BurnNotificationWithTon' as const, amount: _amount, tokenAmount: _tokenAmount, user: _user };
}

function storeTupleBurnNotificationWithTon(source: BurnNotificationWithTon) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeNumber(source.tokenAmount);
    builder.writeAddress(source.user);
    return builder.build();
}

function dictValueParserBurnNotificationWithTon(): DictionaryValue<BurnNotificationWithTon> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBurnNotificationWithTon(src)).endCell());
        },
        parse: (src) => {
            return loadBurnNotificationWithTon(src.loadRef().beginParse());
        }
    }
}

export type WithdrawFromPool = {
    $$type: 'WithdrawFromPool';
    jettonAddress: Address;
    amount: bigint;
}

export function storeWithdrawFromPool(src: WithdrawFromPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3812297287, 32);
        b_0.storeAddress(src.jettonAddress);
        b_0.storeCoins(src.amount);
    };
}

export function loadWithdrawFromPool(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3812297287) { throw Error('Invalid prefix'); }
    let _jettonAddress = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    return { $$type: 'WithdrawFromPool' as const, jettonAddress: _jettonAddress, amount: _amount };
}

function loadTupleWithdrawFromPool(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'WithdrawFromPool' as const, jettonAddress: _jettonAddress, amount: _amount };
}

function loadGetterTupleWithdrawFromPool(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'WithdrawFromPool' as const, jettonAddress: _jettonAddress, amount: _amount };
}

function storeTupleWithdrawFromPool(source: WithdrawFromPool) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserWithdrawFromPool(): DictionaryValue<WithdrawFromPool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawFromPool(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawFromPool(src.loadRef().beginParse());
        }
    }
}

export type TransferOwnership = {
    $$type: 'TransferOwnership';
    newOwner: Address;
}

export function storeTransferOwnership(src: TransferOwnership) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1882669034, 32);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadTransferOwnership(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1882669034) { throw Error('Invalid prefix'); }
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'TransferOwnership' as const, newOwner: _newOwner };
}

function loadTupleTransferOwnership(source: TupleReader) {
    let _newOwner = source.readAddress();
    return { $$type: 'TransferOwnership' as const, newOwner: _newOwner };
}

function loadGetterTupleTransferOwnership(source: TupleReader) {
    let _newOwner = source.readAddress();
    return { $$type: 'TransferOwnership' as const, newOwner: _newOwner };
}

function storeTupleTransferOwnership(source: TransferOwnership) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserTransferOwnership(): DictionaryValue<TransferOwnership> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransferOwnership(src)).endCell());
        },
        parse: (src) => {
            return loadTransferOwnership(src.loadRef().beginParse());
        }
    }
}

export type JettonCore$Data = {
    $$type: 'JettonCore$Data';
    total_supply: bigint;
    owner: Address;
    jetton_content: Cell;
    mintable: boolean;
    max_supply: bigint;
    initial_mint_amount: bigint;
    initial_token_price: bigint;
    curve_steepness: bigint;
    base_amount: bigint;
    pool: Address;
}

export function storeJettonCore$Data(src: JettonCore$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.total_supply);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.jetton_content);
        b_0.storeBit(src.mintable);
        b_0.storeCoins(src.max_supply);
        b_0.storeCoins(src.initial_mint_amount);
        b_0.storeCoins(src.initial_token_price);
        b_0.storeInt(src.curve_steepness, 257);
        let b_1 = new Builder();
        b_1.storeCoins(src.base_amount);
        b_1.storeAddress(src.pool);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadJettonCore$Data(slice: Slice) {
    let sc_0 = slice;
    let _total_supply = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _jetton_content = sc_0.loadRef();
    let _mintable = sc_0.loadBit();
    let _max_supply = sc_0.loadCoins();
    let _initial_mint_amount = sc_0.loadCoins();
    let _initial_token_price = sc_0.loadCoins();
    let _curve_steepness = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _base_amount = sc_1.loadCoins();
    let _pool = sc_1.loadAddress();
    return { $$type: 'JettonCore$Data' as const, total_supply: _total_supply, owner: _owner, jetton_content: _jetton_content, mintable: _mintable, max_supply: _max_supply, initial_mint_amount: _initial_mint_amount, initial_token_price: _initial_token_price, curve_steepness: _curve_steepness, base_amount: _base_amount, pool: _pool };
}

function loadTupleJettonCore$Data(source: TupleReader) {
    let _total_supply = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton_content = source.readCell();
    let _mintable = source.readBoolean();
    let _max_supply = source.readBigNumber();
    let _initial_mint_amount = source.readBigNumber();
    let _initial_token_price = source.readBigNumber();
    let _curve_steepness = source.readBigNumber();
    let _base_amount = source.readBigNumber();
    let _pool = source.readAddress();
    return { $$type: 'JettonCore$Data' as const, total_supply: _total_supply, owner: _owner, jetton_content: _jetton_content, mintable: _mintable, max_supply: _max_supply, initial_mint_amount: _initial_mint_amount, initial_token_price: _initial_token_price, curve_steepness: _curve_steepness, base_amount: _base_amount, pool: _pool };
}

function loadGetterTupleJettonCore$Data(source: TupleReader) {
    let _total_supply = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton_content = source.readCell();
    let _mintable = source.readBoolean();
    let _max_supply = source.readBigNumber();
    let _initial_mint_amount = source.readBigNumber();
    let _initial_token_price = source.readBigNumber();
    let _curve_steepness = source.readBigNumber();
    let _base_amount = source.readBigNumber();
    let _pool = source.readAddress();
    return { $$type: 'JettonCore$Data' as const, total_supply: _total_supply, owner: _owner, jetton_content: _jetton_content, mintable: _mintable, max_supply: _max_supply, initial_mint_amount: _initial_mint_amount, initial_token_price: _initial_token_price, curve_steepness: _curve_steepness, base_amount: _base_amount, pool: _pool };
}

function storeTupleJettonCore$Data(source: JettonCore$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.total_supply);
    builder.writeAddress(source.owner);
    builder.writeCell(source.jetton_content);
    builder.writeBoolean(source.mintable);
    builder.writeNumber(source.max_supply);
    builder.writeNumber(source.initial_mint_amount);
    builder.writeNumber(source.initial_token_price);
    builder.writeNumber(source.curve_steepness);
    builder.writeNumber(source.base_amount);
    builder.writeAddress(source.pool);
    return builder.build();
}

function dictValueParserJettonCore$Data(): DictionaryValue<JettonCore$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonCore$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonCore$Data(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletImp$Data = {
    $$type: 'JettonWalletImp$Data';
    balance: bigint;
    owner: Address;
    jetton_master: Address;
}

export function storeJettonWalletImp$Data(src: JettonWalletImp$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jetton_master);
    };
}

export function loadJettonWalletImp$Data(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _jetton_master = sc_0.loadAddress();
    return { $$type: 'JettonWalletImp$Data' as const, balance: _balance, owner: _owner, jetton_master: _jetton_master };
}

function loadTupleJettonWalletImp$Data(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton_master = source.readAddress();
    return { $$type: 'JettonWalletImp$Data' as const, balance: _balance, owner: _owner, jetton_master: _jetton_master };
}

function loadGetterTupleJettonWalletImp$Data(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton_master = source.readAddress();
    return { $$type: 'JettonWalletImp$Data' as const, balance: _balance, owner: _owner, jetton_master: _jetton_master };
}

function storeTupleJettonWalletImp$Data(source: JettonWalletImp$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.jetton_master);
    return builder.build();
}

function dictValueParserJettonWalletImp$Data(): DictionaryValue<JettonWalletImp$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletImp$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletImp$Data(src.loadRef().beginParse());
        }
    }
}

 type JettonWalletImp_init_args = {
    $$type: 'JettonWalletImp_init_args';
    owner: Address;
    jetton_master: Address;
}

function initJettonWalletImp_init_args(src: JettonWalletImp_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jetton_master);
    };
}

async function JettonWalletImp_init(owner: Address, jetton_master: Address) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initJettonWalletImp_init_args({ $$type: 'JettonWalletImp_init_args', owner, jetton_master })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const JettonWalletImp_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    2296: { message: `JettonWallet: Only Jetton master or Jetton wallet can call this function` },
    9739: { message: `Sender is not a Jetton wallet` },
    13105: { message: `JettonWallet: Not enough jettons to transfer` },
    13824: { message: `Insufficient tokens to burn` },
    14796: { message: `Exceeds max supply` },
    24734: { message: `Invalid wallet address` },
    26288: { message: `Minting is disabled` },
    27544: { message: `Invalid mint amount` },
    29133: { message: `JettonWallet: Not allow negative balance after internal transfer` },
    29951: { message: `Purchase amount must be greater than 0` },
    30061: { message: `JettonMaster: Jetton is not mintable` },
    31558: { message: `Invalid token price` },
    37185: { message: `Not enough funds to transfer` },
    40476: { message: `Amount must be greater than 0` },
    42931: { message: `Not authorized to transfer ownership` },
    43365: { message: `JettonMaster: Sender is not a Jetton owner` },
    50816: { message: `Max supply must be greater than 0` },
    54531: { message: `Invalid initial mint amount` },
    57579: { message: `Only owner can mint` },
    57646: { message: `Amount too small to mint tokens` },
    58297: { message: `Purchase would exceed max supply` },
    58582: { message: `JettonWallet: Only owner can call this function` },
    58866: { message: `Token price must be greater than 0` },
    60354: { message: `JettonWallet: Not enough balance to burn tokens` },
    61350: { message: `Invalid sender: must be pool or valid wallet` },
    63779: { message: `Would exceed max supply` },
}

const JettonWalletImp_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonMint","header":2310479113,"fields":[{"name":"origin","type":{"kind":"simple","type":"address","optional":false}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonData","header":null,"fields":[{"name":"total_supply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"admin_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonTransfer","header":260734629,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonTransferNotification","header":1935855772,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonBurn","header":1499400124,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"JettonExcesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"JettonInternalTransfer","header":395134233,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_address","type":{"kind":"simple","type":"address","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonBurnNotification","header":2078119902,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"WalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"RegisterToken","header":394751612,"fields":[{"name":"tokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"VerifyJetton","header":1099595772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"tokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonVerified","header":1309512043,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"isJetton","type":{"kind":"simple","type":"bool","optional":false}},{"name":"tokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BuyTokens","header":820359839,"fields":[{"name":"resAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SellTokens","header":2538899928,"fields":[{"name":"resAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"tokenAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"PoolBuy","header":843028996,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"PoolSell","header":2040629039,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"AddJetton","header":1824497237,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BuyMint","header":3627142605,"fields":[{"name":"tokenAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BurnNotificationWithTon","header":193322806,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"tokenAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"WithdrawFromPool","header":3812297287,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"TransferOwnership","header":1882669034,"fields":[{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonCore$Data","header":null,"fields":[{"name":"total_supply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"max_supply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"initial_mint_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"initial_token_price","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"curve_steepness","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"base_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"pool","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonWalletImp$Data","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_master","type":{"kind":"simple","type":"address","optional":false}}]},
]

const JettonWalletImp_getters: ABIGetter[] = [
    {"name":"get_wallet_data","arguments":[],"returnType":{"kind":"simple","type":"WalletData","optional":false}},
]

export const JettonWalletImp_getterMapping: { [key: string]: string } = {
    'get_wallet_data': 'getGetWalletData',
}

const JettonWalletImp_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"text","text":"identify"}},
    {"receiver":"internal","message":{"kind":"typed","type":"JettonTransfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"JettonBurn"}},
    {"receiver":"internal","message":{"kind":"typed","type":"JettonInternalTransfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class JettonWalletImp implements Contract {
    
    static async init(owner: Address, jetton_master: Address) {
        return await JettonWalletImp_init(owner, jetton_master);
    }
    
    static async fromInit(owner: Address, jetton_master: Address) {
        const init = await JettonWalletImp_init(owner, jetton_master);
        const address = contractAddress(0, init);
        return new JettonWalletImp(address, init);
    }
    
    static fromAddress(address: Address) {
        return new JettonWalletImp(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  JettonWalletImp_types,
        getters: JettonWalletImp_getters,
        receivers: JettonWalletImp_receivers,
        errors: JettonWalletImp_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: 'identify' | JettonTransfer | JettonBurn | JettonInternalTransfer | Deploy) {
        
        let body: Cell | null = null;
        if (message === 'identify') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonTransfer') {
            body = beginCell().store(storeJettonTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonBurn') {
            body = beginCell().store(storeJettonBurn(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonInternalTransfer') {
            body = beginCell().store(storeJettonInternalTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetWalletData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_wallet_data', builder.build())).stack;
        const result = loadGetterTupleWalletData(source);
        return result;
    }
    
}