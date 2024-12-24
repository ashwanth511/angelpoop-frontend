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

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
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
    tokenAmount: bigint;
}

export function storeBuyTokens(src: BuyTokens) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1801330226, 32);
        b_0.storeInt(src.tokenAmount, 257);
    };
}

export function loadBuyTokens(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1801330226) { throw Error('Invalid prefix'); }
    let _tokenAmount = sc_0.loadIntBig(257);
    return { $$type: 'BuyTokens' as const, tokenAmount: _tokenAmount };
}

function loadTupleBuyTokens(source: TupleReader) {
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'BuyTokens' as const, tokenAmount: _tokenAmount };
}

function loadGetterTupleBuyTokens(source: TupleReader) {
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'BuyTokens' as const, tokenAmount: _tokenAmount };
}

function storeTupleBuyTokens(source: BuyTokens) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.tokenAmount);
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
    tokenAmount: bigint;
}

export function storeSellTokens(src: SellTokens) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1589364685, 32);
        b_0.storeInt(src.tokenAmount, 257);
    };
}

export function loadSellTokens(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1589364685) { throw Error('Invalid prefix'); }
    let _tokenAmount = sc_0.loadIntBig(257);
    return { $$type: 'SellTokens' as const, tokenAmount: _tokenAmount };
}

function loadTupleSellTokens(source: TupleReader) {
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'SellTokens' as const, tokenAmount: _tokenAmount };
}

function loadGetterTupleSellTokens(source: TupleReader) {
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'SellTokens' as const, tokenAmount: _tokenAmount };
}

function storeTupleSellTokens(source: SellTokens) {
    let builder = new TupleBuilder();
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
    amount: bigint;
}

export function storePoolBuy(src: PoolBuy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(350941107, 32);
        b_0.storeAddress(src.jettonAddress);
        b_0.storeCoins(src.amount);
    };
}

export function loadPoolBuy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 350941107) { throw Error('Invalid prefix'); }
    let _jettonAddress = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    return { $$type: 'PoolBuy' as const, jettonAddress: _jettonAddress, amount: _amount };
}

function loadTuplePoolBuy(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'PoolBuy' as const, jettonAddress: _jettonAddress, amount: _amount };
}

function loadGetterTuplePoolBuy(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'PoolBuy' as const, jettonAddress: _jettonAddress, amount: _amount };
}

function storeTuplePoolBuy(source: PoolBuy) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeNumber(source.amount);
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

export type JettonPool = {
    $$type: 'JettonPool';
    balance: bigint;
    isActive: boolean;
}

export function storeJettonPool(src: JettonPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeBit(src.isActive);
    };
}

export function loadJettonPool(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadCoins();
    let _isActive = sc_0.loadBit();
    return { $$type: 'JettonPool' as const, balance: _balance, isActive: _isActive };
}

function loadTupleJettonPool(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _isActive = source.readBoolean();
    return { $$type: 'JettonPool' as const, balance: _balance, isActive: _isActive };
}

function loadGetterTupleJettonPool(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _isActive = source.readBoolean();
    return { $$type: 'JettonPool' as const, balance: _balance, isActive: _isActive };
}

function storeTupleJettonPool(source: JettonPool) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeBoolean(source.isActive);
    return builder.build();
}

function dictValueParserJettonPool(): DictionaryValue<JettonPool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonPool(src)).endCell());
        },
        parse: (src) => {
            return loadJettonPool(src.loadRef().beginParse());
        }
    }
}

export type Pool$Data = {
    $$type: 'Pool$Data';
    owner: Address;
    pools: Dictionary<Address, JettonPool>;
}

export function storePool$Data(src: Pool$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.pools, Dictionary.Keys.Address(), dictValueParserJettonPool());
    };
}

export function loadPool$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _pools = Dictionary.load(Dictionary.Keys.Address(), dictValueParserJettonPool(), sc_0);
    return { $$type: 'Pool$Data' as const, owner: _owner, pools: _pools };
}

function loadTuplePool$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _pools = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonPool(), source.readCellOpt());
    return { $$type: 'Pool$Data' as const, owner: _owner, pools: _pools };
}

function loadGetterTuplePool$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _pools = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonPool(), source.readCellOpt());
    return { $$type: 'Pool$Data' as const, owner: _owner, pools: _pools };
}

function storeTuplePool$Data(source: Pool$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.pools.size > 0 ? beginCell().storeDictDirect(source.pools, Dictionary.Keys.Address(), dictValueParserJettonPool()).endCell() : null);
    return builder.build();
}

function dictValueParserPool$Data(): DictionaryValue<Pool$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePool$Data(src)).endCell());
        },
        parse: (src) => {
            return loadPool$Data(src.loadRef().beginParse());
        }
    }
}

 type Pool_init_args = {
    $$type: 'Pool_init_args';
}

function initPool_init_args(src: Pool_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
    };
}

async function Pool_init() {
    const __code = Cell.fromBase64('te6ccgECGQEABOkAART/APSkE/S88sgLAQIBYgIDAtTQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxa2zzy4ILI+EMBzH8BygBZWSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFvQAye1UFgQCASAODwTMAZIwf+BwIddJwh+VMCDXCx/eIIIQbL+eVbqOrjDTHwGCEGy/nlW68uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDHgIIIQFOrvs7rjAiCCEHmhhy+64wKCEJRqmLa6BQYHCAC8ggCypPhCUkDHBfL0IYEBCyJZ9AtvoZIwbd8gbpIwbZrQ+gDSAFlsEm8C4iBus5+BFZoBIG7y0IBvIjGz8vSRMOKBAQtwf8hZWfoCygDJEiBulTBZ9FkwlEEz9BPifwFmMNMfAYIQFOrvs7ry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfoAWWwSCQGoMNMfAYIQeaGHL7ry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+gBVIGwTCgFYjqfTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gMHALALYigQELI1n0C2+hkjBt3yBukjBtmtD6ANIAWWwSbwLigTr1IW6zmSEgbvLQgG8iMZFw4vL0gQELASBu8tCAbyIwWKB/yFlZ+gLKAMkSIG6VMFn0WTCUQTP0E+J/AeojgQELJFn0C2+hkjBt3yBukjBtmtD6ANIAWWwSbwLigTr1IW6zmSEgbvLQgG8iMZFw4vL0ICBu8tCAbyIwUiC78ub3USF/WXBtbW3bPDCBAQsCIG7y0IBvIjABoX/IWVn6AsoAyRIgbpUwWfRZMJRBM/QT4n8MATxtbSJus5lbIG7y0IBvIgGRMuIQJHADBIBCUCPbPDAMAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CA0AmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCASAQEQIBIBQVAku4I5INdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiNs8WNs8bCGBYSAhG4Ud2zzbPGwhgWEwB4gQELIgJZ9AtvoZIwbd8gbpIwbZrQ+gDSAFlsEm8C4oE69SFus5khIG7y0IBvIjGRcOLy9CBu8tCAbyIwAAIhAku70EINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiNs8WNs8bCGBYXABG4K+7UTQ0gABgBgO1E0NQB+GPSAAGOJfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB9ARZbBLgMPgo1wsKgwm68uCJ2zwYAF6BAQsiAln0C2+hkjBt3yBukjBtmtD6ANIAWWwSbwLiIG6zmCBu8tCAbyIxkjBw4gAG+EJt');
    const __system = Cell.fromBase64('te6cckECGwEABPMAAQHAAQEFoOi/AgEU/wD0pBP0vPLICwMCAWIEDwLU0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8Wts88uCCyPhDAcx/AcoAWVkg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxb0AMntVBcFBMwBkjB/4HAh10nCH5UwINcLH94gghBsv55Vuo6uMNMfAYIQbL+eVbry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMeAgghAU6u+zuuMCIIIQeaGHL7rjAoIQlGqYtroGBwkLALyCALKk+EJSQMcF8vQhgQELIln0C2+hkjBt3yBukjBtmtD6ANIAWWwSbwLiIG6zn4EVmgEgbvLQgG8iMbPy9JEw4oEBC3B/yFlZ+gLKAMkSIG6VMFn0WTCUQTP0E+J/AWYw0x8BghAU6u+zuvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+gBZbBIIALYigQELI1n0C2+hkjBt3yBukjBtmtD6ANIAWWwSbwLigTr1IW6zmSEgbvLQgG8iMZFw4vL0gQELASBu8tCAbyIwWKB/yFlZ+gLKAMkSIG6VMFn0WTCUQTP0E+J/Aagw0x8BghB5oYcvuvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6AFUgbBMKAeojgQELJFn0C2+hkjBt3yBukjBtmtD6ANIAWWwSbwLigTr1IW6zmSEgbvLQgG8iMZFw4vL0ICBu8tCAbyIwUiC78ub3USF/WXBtbW3bPDCBAQsCIG7y0IBvIjABoX/IWVn6AsoAyRIgbpUwWfRZMJRBM/QT4n8NAViOp9MfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8n4QgFwbds8f+AwcAwBPG1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8MA0ByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsIDgCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzAIBIBAVAgEgERMCS7gjkg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCI2zxY2zxsIYFxIAeIEBCyICWfQLb6GSMG3fIG6SMG2a0PoA0gBZbBJvAuKBOvUhbrOZISBu8tCAbyIxkXDi8vQgbvLQgG8iMAIRuFHds82zxsIYFxQAAiECASAWGgJLu9BCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjbPFjbPGwhgXGQGA7UTQ1AH4Y9IAAY4l+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH0BFlsEuAw+CjXCwqDCbry4InbPBgABvhCbQBegQELIgJZ9AtvoZIwbd8gbpIwbZrQ+gDSAFlsEm8C4iBus5ggbvLQgG8iMZIwcOIAEbgr7tRNDSAAGEDcx3M=');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initPool_init_args({ $$type: 'Pool_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const Pool_errors: { [key: number]: { message: string } } = {
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
    1783: { message: `Insufficient liquidity in pool` },
    5530: { message: `Jetton already exists` },
    15093: { message: `Pool for this jetton does not exist` },
    26825: { message: `Only owner can withdraw` },
    35850: { message: `Pool must be empty to remove` },
    42120: { message: `Pool does not exist` },
    45732: { message: `Only owner can add jettons` },
    54615: { message: `Insufficient balance` },
    58172: { message: `Only owner can remove pools` },
}

const Pool_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RegisterToken","header":394751612,"fields":[{"name":"tokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"VerifyJetton","header":1099595772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"tokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonVerified","header":1309512043,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"isJetton","type":{"kind":"simple","type":"bool","optional":false}},{"name":"tokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BuyTokens","header":1801330226,"fields":[{"name":"tokenAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SellTokens","header":1589364685,"fields":[{"name":"tokenAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"PoolBuy","header":350941107,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PoolSell","header":2040629039,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"AddJetton","header":1824497237,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonPool","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"isActive","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Pool$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"pools","type":{"kind":"dict","key":"address","value":"JettonPool","valueFormat":"ref"}}]},
]

const Pool_getters: ABIGetter[] = [
    {"name":"getJettonLiquidity","arguments":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"hasPool","arguments":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const Pool_getterMapping: { [key: string]: string } = {
    'getJettonLiquidity': 'getGetJettonLiquidity',
    'hasPool': 'getHasPool',
    'owner': 'getOwner',
}

const Pool_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddJetton"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PoolBuy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PoolSell"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class Pool implements Contract {
    
    static async init() {
        return await Pool_init();
    }
    
    static async fromInit() {
        const init = await Pool_init();
        const address = contractAddress(0, init);
        return new Pool(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Pool(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Pool_types,
        getters: Pool_getters,
        receivers: Pool_receivers,
        errors: Pool_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddJetton | PoolBuy | PoolSell | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddJetton') {
            body = beginCell().store(storeAddJetton(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PoolBuy') {
            body = beginCell().store(storePoolBuy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PoolSell') {
            body = beginCell().store(storePoolSell(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetJettonLiquidity(provider: ContractProvider, jettonAddress: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(jettonAddress);
        let source = (await provider.get('getJettonLiquidity', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getHasPool(provider: ContractProvider, jettonAddress: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(jettonAddress);
        let source = (await provider.get('hasPool', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}