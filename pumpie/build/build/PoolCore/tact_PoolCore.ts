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

export type PendingSell = {
    $$type: 'PendingSell';
    jettonAddress: Address;
    sender: Address;
    amount: bigint;
}

export function storePendingSell(src: PendingSell) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.jettonAddress);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadPendingSell(slice: Slice) {
    let sc_0 = slice;
    let _jettonAddress = sc_0.loadAddress();
    let _sender = sc_0.loadAddress();
    let _amount = sc_0.loadIntBig(257);
    return { $$type: 'PendingSell' as const, jettonAddress: _jettonAddress, sender: _sender, amount: _amount };
}

function loadTuplePendingSell(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _sender = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'PendingSell' as const, jettonAddress: _jettonAddress, sender: _sender, amount: _amount };
}

function loadGetterTuplePendingSell(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _sender = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'PendingSell' as const, jettonAddress: _jettonAddress, sender: _sender, amount: _amount };
}

function storeTuplePendingSell(source: PendingSell) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserPendingSell(): DictionaryValue<PendingSell> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePendingSell(src)).endCell());
        },
        parse: (src) => {
            return loadPendingSell(src.loadRef().beginParse());
        }
    }
}

export type WalletDataMessage = {
    $$type: 'WalletDataMessage';
    balance: bigint;
    owner: Address;
    jetton: Address;
    jetton_wallet_code: Cell;
}

export function storeWalletDataMessage(src: WalletDataMessage) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4074162984, 32);
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jetton);
        b_0.storeRef(src.jetton_wallet_code);
    };
}

export function loadWalletDataMessage(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4074162984) { throw Error('Invalid prefix'); }
    let _balance = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _jetton = sc_0.loadAddress();
    let _jetton_wallet_code = sc_0.loadRef();
    return { $$type: 'WalletDataMessage' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function loadTupleWalletDataMessage(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton = source.readAddress();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'WalletDataMessage' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function loadGetterTupleWalletDataMessage(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton = source.readAddress();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'WalletDataMessage' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function storeTupleWalletDataMessage(source: WalletDataMessage) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.jetton);
    builder.writeCell(source.jetton_wallet_code);
    return builder.build();
}

function dictValueParserWalletDataMessage(): DictionaryValue<WalletDataMessage> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWalletDataMessage(src)).endCell());
        },
        parse: (src) => {
            return loadWalletDataMessage(src.loadRef().beginParse());
        }
    }
}

export type DeployJetton = {
    $$type: 'DeployJetton';
    owner: Address;
    content: Cell;
    max_supply: bigint;
    token_price: bigint;
    initial_mint: bigint;
    pool: Address;
}

export function storeDeployJetton(src: DeployJetton) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1581859115, 32);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeInt(src.max_supply, 257);
        b_0.storeInt(src.token_price, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.initial_mint, 257);
        b_1.storeAddress(src.pool);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadDeployJetton(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1581859115) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _max_supply = sc_0.loadIntBig(257);
    let _token_price = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _initial_mint = sc_1.loadIntBig(257);
    let _pool = sc_1.loadAddress();
    return { $$type: 'DeployJetton' as const, owner: _owner, content: _content, max_supply: _max_supply, token_price: _token_price, initial_mint: _initial_mint, pool: _pool };
}

function loadTupleDeployJetton(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _max_supply = source.readBigNumber();
    let _token_price = source.readBigNumber();
    let _initial_mint = source.readBigNumber();
    let _pool = source.readAddress();
    return { $$type: 'DeployJetton' as const, owner: _owner, content: _content, max_supply: _max_supply, token_price: _token_price, initial_mint: _initial_mint, pool: _pool };
}

function loadGetterTupleDeployJetton(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _max_supply = source.readBigNumber();
    let _token_price = source.readBigNumber();
    let _initial_mint = source.readBigNumber();
    let _pool = source.readAddress();
    return { $$type: 'DeployJetton' as const, owner: _owner, content: _content, max_supply: _max_supply, token_price: _token_price, initial_mint: _initial_mint, pool: _pool };
}

function storeTupleDeployJetton(source: DeployJetton) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeNumber(source.max_supply);
    builder.writeNumber(source.token_price);
    builder.writeNumber(source.initial_mint);
    builder.writeAddress(source.pool);
    return builder.build();
}

function dictValueParserDeployJetton(): DictionaryValue<DeployJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployJetton(src)).endCell());
        },
        parse: (src) => {
            return loadDeployJetton(src.loadRef().beginParse());
        }
    }
}

export type PoolCore$Data = {
    $$type: 'PoolCore$Data';
    owner: Address;
    pools: Dictionary<Address, JettonPool>;
    pendingSells: Dictionary<Address, PendingSell>;
}

export function storePoolCore$Data(src: PoolCore$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.pools, Dictionary.Keys.Address(), dictValueParserJettonPool());
        b_0.storeDict(src.pendingSells, Dictionary.Keys.Address(), dictValueParserPendingSell());
    };
}

export function loadPoolCore$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _pools = Dictionary.load(Dictionary.Keys.Address(), dictValueParserJettonPool(), sc_0);
    let _pendingSells = Dictionary.load(Dictionary.Keys.Address(), dictValueParserPendingSell(), sc_0);
    return { $$type: 'PoolCore$Data' as const, owner: _owner, pools: _pools, pendingSells: _pendingSells };
}

function loadTuplePoolCore$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _pools = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonPool(), source.readCellOpt());
    let _pendingSells = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserPendingSell(), source.readCellOpt());
    return { $$type: 'PoolCore$Data' as const, owner: _owner, pools: _pools, pendingSells: _pendingSells };
}

function loadGetterTuplePoolCore$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _pools = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserJettonPool(), source.readCellOpt());
    let _pendingSells = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserPendingSell(), source.readCellOpt());
    return { $$type: 'PoolCore$Data' as const, owner: _owner, pools: _pools, pendingSells: _pendingSells };
}

function storeTuplePoolCore$Data(source: PoolCore$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.pools.size > 0 ? beginCell().storeDictDirect(source.pools, Dictionary.Keys.Address(), dictValueParserJettonPool()).endCell() : null);
    builder.writeCell(source.pendingSells.size > 0 ? beginCell().storeDictDirect(source.pendingSells, Dictionary.Keys.Address(), dictValueParserPendingSell()).endCell() : null);
    return builder.build();
}

function dictValueParserPoolCore$Data(): DictionaryValue<PoolCore$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePoolCore$Data(src)).endCell());
        },
        parse: (src) => {
            return loadPoolCore$Data(src.loadRef().beginParse());
        }
    }
}

 type PoolCore_init_args = {
    $$type: 'PoolCore_init_args';
}

function initPoolCore_init_args(src: PoolCore_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
    };
}

async function PoolCore_init() {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initPoolCore_init_args({ $$type: 'PoolCore_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const PoolCore_errors: { [key: number]: { message: string } } = {
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
    5530: { message: `Jetton already exists` },
    9739: { message: `Sender is not a Jetton wallet` },
    9899: { message: `No pending sell request` },
    13105: { message: `JettonWallet: Not enough jettons to transfer` },
    13824: { message: `Insufficient tokens to burn` },
    14796: { message: `Exceeds max supply` },
    15093: { message: `Pool for this jetton does not exist` },
    15703: { message: `Insufficient Jetton balance` },
    21185: { message: `Insufficient gas for withdrawal` },
    24734: { message: `Invalid wallet address` },
    26288: { message: `Minting is disabled` },
    26825: { message: `Only owner can withdraw` },
    27544: { message: `Invalid mint amount` },
    29133: { message: `JettonWallet: Not allow negative balance after internal transfer` },
    29951: { message: `Purchase amount must be greater than 0` },
    30061: { message: `JettonMaster: Jetton is not mintable` },
    31558: { message: `Invalid token price` },
    35850: { message: `Pool must be empty to remove` },
    37185: { message: `Not enough funds to transfer` },
    40476: { message: `Amount must be greater than 0` },
    42120: { message: `Pool does not exist` },
    42931: { message: `Not authorized to transfer ownership` },
    43365: { message: `JettonMaster: Sender is not a Jetton owner` },
    45732: { message: `Only owner can add jettons` },
    47483: { message: `Insufficient value sent for deployment` },
    50816: { message: `Max supply must be greater than 0` },
    54531: { message: `Invalid initial mint amount` },
    54615: { message: `Insufficient balance` },
    57579: { message: `Only owner can mint` },
    57646: { message: `Amount too small to mint tokens` },
    57964: { message: `Insufficient pool balance` },
    58172: { message: `Only owner can remove pools` },
    58297: { message: `Purchase would exceed max supply` },
    58582: { message: `JettonWallet: Only owner can call this function` },
    58866: { message: `Token price must be greater than 0` },
    60354: { message: `JettonWallet: Not enough balance to burn tokens` },
    61350: { message: `Invalid sender: must be pool or valid wallet` },
    62441: { message: `Insufficient value sent` },
    63779: { message: `Would exceed max supply` },
}

const PoolCore_types: ABIType[] = [
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
    {"name":"JettonMint","header":2310479113,"fields":[{"name":"origin","type":{"kind":"simple","type":"address","optional":false}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonData","header":null,"fields":[{"name":"total_supply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"admin_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonTransfer","header":260734629,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonTransferNotification","header":1935855772,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonBurn","header":1499400124,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"JettonExcesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"JettonInternalTransfer","header":395134233,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_address","type":{"kind":"simple","type":"address","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonBurnNotification","header":2078119902,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"WalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonPool","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"isActive","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"PendingSell","header":null,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"WalletDataMessage","header":4074162984,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"DeployJetton","header":1581859115,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"max_supply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"token_price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"initial_mint","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pool","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"PoolCore$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"pools","type":{"kind":"dict","key":"address","value":"JettonPool","valueFormat":"ref"}},{"name":"pendingSells","type":{"kind":"dict","key":"address","value":"PendingSell","valueFormat":"ref"}}]},
]

const PoolCore_getters: ABIGetter[] = [
    {"name":"getJettonLiquidity","arguments":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"hasPool","arguments":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"getJettonAddress","arguments":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const PoolCore_getterMapping: { [key: string]: string } = {
    'getJettonLiquidity': 'getGetJettonLiquidity',
    'hasPool': 'getHasPool',
    'getJettonAddress': 'getGetJettonAddress',
    'owner': 'getOwner',
}

const PoolCore_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddJetton"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PoolBuy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PoolSell"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WalletDataMessage"}},
    {"receiver":"internal","message":{"kind":"typed","type":"DeployJetton"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawFromPool"}},
    {"receiver":"internal","message":{"kind":"text","text":"withdrawAllTon"}},
    {"receiver":"internal","message":{"kind":"text","text":"withdraw_all"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BurnNotificationWithTon"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class PoolCore implements Contract {
    
    static async init() {
        return await PoolCore_init();
    }
    
    static async fromInit() {
        const init = await PoolCore_init();
        const address = contractAddress(0, init);
        return new PoolCore(address, init);
    }
    
    static fromAddress(address: Address) {
        return new PoolCore(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  PoolCore_types,
        getters: PoolCore_getters,
        receivers: PoolCore_receivers,
        errors: PoolCore_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddJetton | PoolBuy | PoolSell | WalletDataMessage | DeployJetton | WithdrawFromPool | 'withdrawAllTon' | 'withdraw_all' | BurnNotificationWithTon | Deploy) {
        
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WalletDataMessage') {
            body = beginCell().store(storeWalletDataMessage(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DeployJetton') {
            body = beginCell().store(storeDeployJetton(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawFromPool') {
            body = beginCell().store(storeWithdrawFromPool(message)).endCell();
        }
        if (message === 'withdrawAllTon') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === 'withdraw_all') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BurnNotificationWithTon') {
            body = beginCell().store(storeBurnNotificationWithTon(message)).endCell();
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
    
    async getGetJettonAddress(provider: ContractProvider, owner: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(owner);
        let source = (await provider.get('getJettonAddress', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}