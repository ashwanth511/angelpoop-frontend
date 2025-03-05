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

export type LaunchToken = {
    $$type: 'LaunchToken';
    content: Tep64TokenData;
}

export function storeLaunchToken(src: LaunchToken) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1337048928, 32);
        b_0.store(storeTep64TokenData(src.content));
    };
}

export function loadLaunchToken(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1337048928) { throw Error('Invalid prefix'); }
    let _content = loadTep64TokenData(sc_0);
    return { $$type: 'LaunchToken' as const, content: _content };
}

function loadTupleLaunchToken(source: TupleReader) {
    const _content = loadTupleTep64TokenData(source);
    return { $$type: 'LaunchToken' as const, content: _content };
}

function loadGetterTupleLaunchToken(source: TupleReader) {
    const _content = loadGetterTupleTep64TokenData(source);
    return { $$type: 'LaunchToken' as const, content: _content };
}

function storeTupleLaunchToken(source: LaunchToken) {
    let builder = new TupleBuilder();
    builder.writeTuple(storeTupleTep64TokenData(source.content));
    return builder.build();
}

function dictValueParserLaunchToken(): DictionaryValue<LaunchToken> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLaunchToken(src)).endCell());
        },
        parse: (src) => {
            return loadLaunchToken(src.loadRef().beginParse());
        }
    }
}

export type BuyFromPool = {
    $$type: 'BuyFromPool';
    jettonMasterAddress: Address;
}

export function storeBuyFromPool(src: BuyFromPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2563719859, 32);
        b_0.storeAddress(src.jettonMasterAddress);
    };
}

export function loadBuyFromPool(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2563719859) { throw Error('Invalid prefix'); }
    let _jettonMasterAddress = sc_0.loadAddress();
    return { $$type: 'BuyFromPool' as const, jettonMasterAddress: _jettonMasterAddress };
}

function loadTupleBuyFromPool(source: TupleReader) {
    let _jettonMasterAddress = source.readAddress();
    return { $$type: 'BuyFromPool' as const, jettonMasterAddress: _jettonMasterAddress };
}

function loadGetterTupleBuyFromPool(source: TupleReader) {
    let _jettonMasterAddress = source.readAddress();
    return { $$type: 'BuyFromPool' as const, jettonMasterAddress: _jettonMasterAddress };
}

function storeTupleBuyFromPool(source: BuyFromPool) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonMasterAddress);
    return builder.build();
}

function dictValueParserBuyFromPool(): DictionaryValue<BuyFromPool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuyFromPool(src)).endCell());
        },
        parse: (src) => {
            return loadBuyFromPool(src.loadRef().beginParse());
        }
    }
}

export type SellFromPool = {
    $$type: 'SellFromPool';
    jettonMasterAddress: Address;
    amount: bigint;
}

export function storeSellFromPool(src: SellFromPool) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(477931964, 32);
        b_0.storeAddress(src.jettonMasterAddress);
        b_0.storeCoins(src.amount);
    };
}

export function loadSellFromPool(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 477931964) { throw Error('Invalid prefix'); }
    let _jettonMasterAddress = sc_0.loadAddress();
    let _amount = sc_0.loadCoins();
    return { $$type: 'SellFromPool' as const, jettonMasterAddress: _jettonMasterAddress, amount: _amount };
}

function loadTupleSellFromPool(source: TupleReader) {
    let _jettonMasterAddress = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'SellFromPool' as const, jettonMasterAddress: _jettonMasterAddress, amount: _amount };
}

function loadGetterTupleSellFromPool(source: TupleReader) {
    let _jettonMasterAddress = source.readAddress();
    let _amount = source.readBigNumber();
    return { $$type: 'SellFromPool' as const, jettonMasterAddress: _jettonMasterAddress, amount: _amount };
}

function storeTupleSellFromPool(source: SellFromPool) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonMasterAddress);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserSellFromPool(): DictionaryValue<SellFromPool> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSellFromPool(src)).endCell());
        },
        parse: (src) => {
            return loadSellFromPool(src.loadRef().beginParse());
        }
    }
}

export type JettonMasterTemplate$Data = {
    $$type: 'JettonMasterTemplate$Data';
    owner: Address;
    staticTax: bigint;
    lockedValue: bigint;
    content: Cell;
    totalSupply: bigint;
    max_supply: bigint;
    initial_price: bigint;
    curve_steepness: bigint;
    base_amount: bigint;
    mintable: boolean;
}

export function storeJettonMasterTemplate$Data(src: JettonMasterTemplate$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.staticTax);
        b_0.storeCoins(src.lockedValue);
        b_0.storeRef(src.content);
        b_0.storeCoins(src.totalSupply);
        b_0.storeCoins(src.max_supply);
        b_0.storeCoins(src.initial_price);
        let b_1 = new Builder();
        b_1.storeInt(src.curve_steepness, 257);
        b_1.storeCoins(src.base_amount);
        b_1.storeBit(src.mintable);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadJettonMasterTemplate$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _staticTax = sc_0.loadCoins();
    let _lockedValue = sc_0.loadCoins();
    let _content = sc_0.loadRef();
    let _totalSupply = sc_0.loadCoins();
    let _max_supply = sc_0.loadCoins();
    let _initial_price = sc_0.loadCoins();
    let sc_1 = sc_0.loadRef().beginParse();
    let _curve_steepness = sc_1.loadIntBig(257);
    let _base_amount = sc_1.loadCoins();
    let _mintable = sc_1.loadBit();
    return { $$type: 'JettonMasterTemplate$Data' as const, owner: _owner, staticTax: _staticTax, lockedValue: _lockedValue, content: _content, totalSupply: _totalSupply, max_supply: _max_supply, initial_price: _initial_price, curve_steepness: _curve_steepness, base_amount: _base_amount, mintable: _mintable };
}

function loadTupleJettonMasterTemplate$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _staticTax = source.readBigNumber();
    let _lockedValue = source.readBigNumber();
    let _content = source.readCell();
    let _totalSupply = source.readBigNumber();
    let _max_supply = source.readBigNumber();
    let _initial_price = source.readBigNumber();
    let _curve_steepness = source.readBigNumber();
    let _base_amount = source.readBigNumber();
    let _mintable = source.readBoolean();
    return { $$type: 'JettonMasterTemplate$Data' as const, owner: _owner, staticTax: _staticTax, lockedValue: _lockedValue, content: _content, totalSupply: _totalSupply, max_supply: _max_supply, initial_price: _initial_price, curve_steepness: _curve_steepness, base_amount: _base_amount, mintable: _mintable };
}

function loadGetterTupleJettonMasterTemplate$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _staticTax = source.readBigNumber();
    let _lockedValue = source.readBigNumber();
    let _content = source.readCell();
    let _totalSupply = source.readBigNumber();
    let _max_supply = source.readBigNumber();
    let _initial_price = source.readBigNumber();
    let _curve_steepness = source.readBigNumber();
    let _base_amount = source.readBigNumber();
    let _mintable = source.readBoolean();
    return { $$type: 'JettonMasterTemplate$Data' as const, owner: _owner, staticTax: _staticTax, lockedValue: _lockedValue, content: _content, totalSupply: _totalSupply, max_supply: _max_supply, initial_price: _initial_price, curve_steepness: _curve_steepness, base_amount: _base_amount, mintable: _mintable };
}

function storeTupleJettonMasterTemplate$Data(source: JettonMasterTemplate$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.staticTax);
    builder.writeNumber(source.lockedValue);
    builder.writeCell(source.content);
    builder.writeNumber(source.totalSupply);
    builder.writeNumber(source.max_supply);
    builder.writeNumber(source.initial_price);
    builder.writeNumber(source.curve_steepness);
    builder.writeNumber(source.base_amount);
    builder.writeBoolean(source.mintable);
    return builder.build();
}

function dictValueParserJettonMasterTemplate$Data(): DictionaryValue<JettonMasterTemplate$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonMasterTemplate$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonMasterTemplate$Data(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletTemplate$Data = {
    $$type: 'JettonWalletTemplate$Data';
    owner: Address;
    master: Address;
    balance: bigint;
    staticTax: bigint;
    lockedValue: bigint;
}

export function storeJettonWalletTemplate$Data(src: JettonWalletTemplate$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeInt(src.balance, 257);
        b_0.storeCoins(src.staticTax);
        let b_1 = new Builder();
        b_1.storeCoins(src.lockedValue);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadJettonWalletTemplate$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _master = sc_0.loadAddress();
    let _balance = sc_0.loadIntBig(257);
    let _staticTax = sc_0.loadCoins();
    let sc_1 = sc_0.loadRef().beginParse();
    let _lockedValue = sc_1.loadCoins();
    return { $$type: 'JettonWalletTemplate$Data' as const, owner: _owner, master: _master, balance: _balance, staticTax: _staticTax, lockedValue: _lockedValue };
}

function loadTupleJettonWalletTemplate$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _balance = source.readBigNumber();
    let _staticTax = source.readBigNumber();
    let _lockedValue = source.readBigNumber();
    return { $$type: 'JettonWalletTemplate$Data' as const, owner: _owner, master: _master, balance: _balance, staticTax: _staticTax, lockedValue: _lockedValue };
}

function loadGetterTupleJettonWalletTemplate$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _balance = source.readBigNumber();
    let _staticTax = source.readBigNumber();
    let _lockedValue = source.readBigNumber();
    return { $$type: 'JettonWalletTemplate$Data' as const, owner: _owner, master: _master, balance: _balance, staticTax: _staticTax, lockedValue: _lockedValue };
}

function storeTupleJettonWalletTemplate$Data(source: JettonWalletTemplate$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeNumber(source.balance);
    builder.writeNumber(source.staticTax);
    builder.writeNumber(source.lockedValue);
    return builder.build();
}

function dictValueParserJettonWalletTemplate$Data(): DictionaryValue<JettonWalletTemplate$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletTemplate$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletTemplate$Data(src.loadRef().beginParse());
        }
    }
}

export type MintJetton = {
    $$type: 'MintJetton';
    queryId: bigint;
    amount: bigint;
    receiver: Address;
    responseDestination: Address;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
}

export function storeMintJetton(src: MintJetton) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2777909359, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
        b_0.storeAddress(src.responseDestination);
        b_0.storeCoins(src.forwardAmount);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_0.storeBit(true).storeRef(src.forwardPayload); } else { b_0.storeBit(false); }
    };
}

export function loadMintJetton(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2777909359) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadIntBig(257);
    let _receiver = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    let _forwardAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'MintJetton' as const, queryId: _queryId, amount: _amount, receiver: _receiver, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleMintJetton(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'MintJetton' as const, queryId: _queryId, amount: _amount, receiver: _receiver, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleMintJetton(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'MintJetton' as const, queryId: _queryId, amount: _amount, receiver: _receiver, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleMintJetton(source: MintJetton) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    builder.writeAddress(source.responseDestination);
    builder.writeNumber(source.forwardAmount);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserMintJetton(): DictionaryValue<MintJetton> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMintJetton(src)).endCell());
        },
        parse: (src) => {
            return loadMintJetton(src.loadRef().beginParse());
        }
    }
}

export type MultiMint = {
    $$type: 'MultiMint';
    queryId: bigint;
    receivers: Dictionary<number, MultiMintReceiver>;
    receiverCount: bigint;
}

export function storeMultiMint(src: MultiMint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3884814387, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeDict(src.receivers, Dictionary.Keys.Uint(32), dictValueParserMultiMintReceiver());
        b_0.storeUint(src.receiverCount, 32);
    };
}

export function loadMultiMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3884814387) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _receivers = Dictionary.load(Dictionary.Keys.Uint(32), dictValueParserMultiMintReceiver(), sc_0);
    let _receiverCount = sc_0.loadUintBig(32);
    return { $$type: 'MultiMint' as const, queryId: _queryId, receivers: _receivers, receiverCount: _receiverCount };
}

function loadTupleMultiMint(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _receivers = Dictionary.loadDirect(Dictionary.Keys.Uint(32), dictValueParserMultiMintReceiver(), source.readCellOpt());
    let _receiverCount = source.readBigNumber();
    return { $$type: 'MultiMint' as const, queryId: _queryId, receivers: _receivers, receiverCount: _receiverCount };
}

function loadGetterTupleMultiMint(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _receivers = Dictionary.loadDirect(Dictionary.Keys.Uint(32), dictValueParserMultiMintReceiver(), source.readCellOpt());
    let _receiverCount = source.readBigNumber();
    return { $$type: 'MultiMint' as const, queryId: _queryId, receivers: _receivers, receiverCount: _receiverCount };
}

function storeTupleMultiMint(source: MultiMint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeCell(source.receivers.size > 0 ? beginCell().storeDictDirect(source.receivers, Dictionary.Keys.Uint(32), dictValueParserMultiMintReceiver()).endCell() : null);
    builder.writeNumber(source.receiverCount);
    return builder.build();
}

function dictValueParserMultiMint(): DictionaryValue<MultiMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMultiMint(src)).endCell());
        },
        parse: (src) => {
            return loadMultiMint(src.loadRef().beginParse());
        }
    }
}

export type UpdateJettonContent = {
    $$type: 'UpdateJettonContent';
    queryId: bigint;
    content: Tep64TokenData;
}

export function storeUpdateJettonContent(src: UpdateJettonContent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3810709628, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.store(storeTep64TokenData(src.content));
    };
}

export function loadUpdateJettonContent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3810709628) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _content = loadTep64TokenData(sc_0);
    return { $$type: 'UpdateJettonContent' as const, queryId: _queryId, content: _content };
}

function loadTupleUpdateJettonContent(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _content = loadTupleTep64TokenData(source);
    return { $$type: 'UpdateJettonContent' as const, queryId: _queryId, content: _content };
}

function loadGetterTupleUpdateJettonContent(source: TupleReader) {
    let _queryId = source.readBigNumber();
    const _content = loadGetterTupleTep64TokenData(source);
    return { $$type: 'UpdateJettonContent' as const, queryId: _queryId, content: _content };
}

function storeTupleUpdateJettonContent(source: UpdateJettonContent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeTuple(storeTupleTep64TokenData(source.content));
    return builder.build();
}

function dictValueParserUpdateJettonContent(): DictionaryValue<UpdateJettonContent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateJettonContent(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateJettonContent(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    balance: bigint;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeRef(src.walletCode);
    };
}

export function loadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _master = sc_0.loadAddress();
    let _walletCode = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function loadTupleJettonWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function loadGetterTupleJettonWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function storeTupleJettonWalletData(source: JettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeCell(source.walletCode);
    return builder.build();
}

function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type JettonMasterData = {
    $$type: 'JettonMasterData';
    totalSupply: bigint;
    mintable: boolean;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

export function storeJettonMasterData(src: JettonMasterData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.totalSupply, 257);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.walletCode);
    };
}

export function loadJettonMasterData(slice: Slice) {
    let sc_0 = slice;
    let _totalSupply = sc_0.loadIntBig(257);
    let _mintable = sc_0.loadBit();
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _walletCode = sc_0.loadRef();
    return { $$type: 'JettonMasterData' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode };
}

function loadTupleJettonMasterData(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _walletCode = source.readCell();
    return { $$type: 'JettonMasterData' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode };
}

function loadGetterTupleJettonMasterData(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _walletCode = source.readCell();
    return { $$type: 'JettonMasterData' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode };
}

function storeTupleJettonMasterData(source: JettonMasterData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeCell(source.walletCode);
    return builder.build();
}

function dictValueParserJettonMasterData(): DictionaryValue<JettonMasterData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonMasterData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonMasterData(src.loadRef().beginParse());
        }
    }
}

export type MultiMintReceiver = {
    $$type: 'MultiMintReceiver';
    receiver: Address;
    amount: bigint;
    tonAmount: bigint;
    responseDestination: Address;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
}

export function storeMultiMintReceiver(src: MultiMintReceiver) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.receiver);
        b_0.storeInt(src.amount, 257);
        b_0.storeCoins(src.tonAmount);
        b_0.storeAddress(src.responseDestination);
        let b_1 = new Builder();
        b_1.storeCoins(src.forwardAmount);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_1.storeBit(true).storeRef(src.forwardPayload); } else { b_1.storeBit(false); }
        b_0.storeRef(b_1.endCell());
    };
}

export function loadMultiMintReceiver(slice: Slice) {
    let sc_0 = slice;
    let _receiver = sc_0.loadAddress();
    let _amount = sc_0.loadIntBig(257);
    let _tonAmount = sc_0.loadCoins();
    let _responseDestination = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _forwardAmount = sc_1.loadCoins();
    let _forwardPayload = sc_1.loadBit() ? sc_1.loadRef() : null;
    return { $$type: 'MultiMintReceiver' as const, receiver: _receiver, amount: _amount, tonAmount: _tonAmount, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleMultiMintReceiver(source: TupleReader) {
    let _receiver = source.readAddress();
    let _amount = source.readBigNumber();
    let _tonAmount = source.readBigNumber();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'MultiMintReceiver' as const, receiver: _receiver, amount: _amount, tonAmount: _tonAmount, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleMultiMintReceiver(source: TupleReader) {
    let _receiver = source.readAddress();
    let _amount = source.readBigNumber();
    let _tonAmount = source.readBigNumber();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'MultiMintReceiver' as const, receiver: _receiver, amount: _amount, tonAmount: _tonAmount, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleMultiMintReceiver(source: MultiMintReceiver) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.receiver);
    builder.writeNumber(source.amount);
    builder.writeNumber(source.tonAmount);
    builder.writeAddress(source.responseDestination);
    builder.writeNumber(source.forwardAmount);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserMultiMintReceiver(): DictionaryValue<MultiMintReceiver> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMultiMintReceiver(src)).endCell());
        },
        parse: (src) => {
            return loadMultiMintReceiver(src.loadRef().beginParse());
        }
    }
}

export type BuyToken = {
    $$type: 'BuyToken';
    receiverAddress: Address;
    jettonMasterAddress: Address;
}

export function storeBuyToken(src: BuyToken) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3344745460, 32);
        b_0.storeAddress(src.receiverAddress);
        b_0.storeAddress(src.jettonMasterAddress);
    };
}

export function loadBuyToken(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3344745460) { throw Error('Invalid prefix'); }
    let _receiverAddress = sc_0.loadAddress();
    let _jettonMasterAddress = sc_0.loadAddress();
    return { $$type: 'BuyToken' as const, receiverAddress: _receiverAddress, jettonMasterAddress: _jettonMasterAddress };
}

function loadTupleBuyToken(source: TupleReader) {
    let _receiverAddress = source.readAddress();
    let _jettonMasterAddress = source.readAddress();
    return { $$type: 'BuyToken' as const, receiverAddress: _receiverAddress, jettonMasterAddress: _jettonMasterAddress };
}

function loadGetterTupleBuyToken(source: TupleReader) {
    let _receiverAddress = source.readAddress();
    let _jettonMasterAddress = source.readAddress();
    return { $$type: 'BuyToken' as const, receiverAddress: _receiverAddress, jettonMasterAddress: _jettonMasterAddress };
}

function storeTupleBuyToken(source: BuyToken) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.receiverAddress);
    builder.writeAddress(source.jettonMasterAddress);
    return builder.build();
}

function dictValueParserBuyToken(): DictionaryValue<BuyToken> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuyToken(src)).endCell());
        },
        parse: (src) => {
            return loadBuyToken(src.loadRef().beginParse());
        }
    }
}

export type SellToken = {
    $$type: 'SellToken';
    receiverAddress: Address;
    jettonAmount: bigint;
}

export function storeSellToken(src: SellToken) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(816927465, 32);
        b_0.storeAddress(src.receiverAddress);
        b_0.storeCoins(src.jettonAmount);
    };
}

export function loadSellToken(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 816927465) { throw Error('Invalid prefix'); }
    let _receiverAddress = sc_0.loadAddress();
    let _jettonAmount = sc_0.loadCoins();
    return { $$type: 'SellToken' as const, receiverAddress: _receiverAddress, jettonAmount: _jettonAmount };
}

function loadTupleSellToken(source: TupleReader) {
    let _receiverAddress = source.readAddress();
    let _jettonAmount = source.readBigNumber();
    return { $$type: 'SellToken' as const, receiverAddress: _receiverAddress, jettonAmount: _jettonAmount };
}

function loadGetterTupleSellToken(source: TupleReader) {
    let _receiverAddress = source.readAddress();
    let _jettonAmount = source.readBigNumber();
    return { $$type: 'SellToken' as const, receiverAddress: _receiverAddress, jettonAmount: _jettonAmount };
}

function storeTupleSellToken(source: SellToken) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.receiverAddress);
    builder.writeNumber(source.jettonAmount);
    return builder.build();
}

function dictValueParserSellToken(): DictionaryValue<SellToken> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSellToken(src)).endCell());
        },
        parse: (src) => {
            return loadSellToken(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell | null;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardAmount);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_0.storeBit(true).storeRef(src.forwardPayload); } else { b_0.storeBit(false); }
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forwardAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardAmount);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type TokenTransferInternal = {
    $$type: 'TokenTransferInternal';
    queryId: bigint;
    amount: bigint;
    from: Address;
    responseDestination: Address;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
}

export function storeTokenTransferInternal(src: TokenTransferInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.responseDestination);
        b_0.storeCoins(src.forwardAmount);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_0.storeBit(true).storeRef(src.forwardPayload); } else { b_0.storeBit(false); }
    };
}

export function loadTokenTransferInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    let _forwardAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'TokenTransferInternal' as const, queryId: _queryId, amount: _amount, from: _from, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleTokenTransferInternal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'TokenTransferInternal' as const, queryId: _queryId, amount: _amount, from: _from, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleTokenTransferInternal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _responseDestination = source.readAddress();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'TokenTransferInternal' as const, queryId: _queryId, amount: _amount, from: _from, responseDestination: _responseDestination, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleTokenTransferInternal(source: TokenTransferInternal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.responseDestination);
    builder.writeNumber(source.forwardAmount);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserTokenTransferInternal(): DictionaryValue<TokenTransferInternal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransferInternal(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransferInternal(src.loadRef().beginParse());
        }
    }
}

export type TransferNotification = {
    $$type: 'TransferNotification';
    queryId: bigint;
    amount: bigint;
    sender: Address;
    forwardPayload: Cell | null;
}

export function storeTransferNotification(src: TransferNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_0.storeBit(true).storeRef(src.forwardPayload); } else { b_0.storeBit(false); }
    };
}

export function loadTransferNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _forwardPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'TransferNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

function loadTupleTransferNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'TransferNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

function loadGetterTupleTransferNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'TransferNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

function storeTupleTransferNotification(source: TransferNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserTransferNotification(): DictionaryValue<TransferNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTransferNotification(src.loadRef().beginParse());
        }
    }
}

export type Burn = {
    $$type: 'Burn';
    queryId: bigint;
    amount: bigint;
    responseDestination: Address;
    customPayload: Cell | null;
}

export function storeBurn(src: Burn) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
    };
}

export function loadBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _responseDestination = sc_0.loadAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Burn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

function loadTupleBurn(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    return { $$type: 'Burn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

function loadGetterTupleBurn(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    return { $$type: 'Burn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

function storeTupleBurn(source: Burn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    return builder.build();
}

function dictValueParserBurn(): DictionaryValue<Burn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBurn(src)).endCell());
        },
        parse: (src) => {
            return loadBurn(src.loadRef().beginParse());
        }
    }
}

export type TokenBurnNotification = {
    $$type: 'TokenBurnNotification';
    queryId: bigint;
    amount: bigint;
    sender: Address;
    responseDestination: Address;
}

export function storeTokenBurnNotification(src: TokenBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.responseDestination);
    };
}

export function loadTokenBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

function loadTupleTokenBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _responseDestination = source.readAddress();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

function loadGetterTupleTokenBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _responseDestination = source.readAddress();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

function storeTupleTokenBurnNotification(source: TokenBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeAddress(source.responseDestination);
    return builder.build();
}

function dictValueParserTokenBurnNotification(): DictionaryValue<TokenBurnNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    queryId: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, queryId: _queryId };
}

function loadTupleExcesses(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Excesses' as const, queryId: _queryId };
}

function loadGetterTupleExcesses(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Excesses' as const, queryId: _queryId };
}

function storeTupleExcesses(source: Excesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type ProvideWalletAddress = {
    $$type: 'ProvideWalletAddress';
    queryId: bigint;
    ownerAddress: Address;
    includeAddress: boolean;
}

export function storeProvideWalletAddress(src: ProvideWalletAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(745978227, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.ownerAddress);
        b_0.storeBit(src.includeAddress);
    };
}

export function loadProvideWalletAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 745978227) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _ownerAddress = sc_0.loadAddress();
    let _includeAddress = sc_0.loadBit();
    return { $$type: 'ProvideWalletAddress' as const, queryId: _queryId, ownerAddress: _ownerAddress, includeAddress: _includeAddress };
}

function loadTupleProvideWalletAddress(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _ownerAddress = source.readAddress();
    let _includeAddress = source.readBoolean();
    return { $$type: 'ProvideWalletAddress' as const, queryId: _queryId, ownerAddress: _ownerAddress, includeAddress: _includeAddress };
}

function loadGetterTupleProvideWalletAddress(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _ownerAddress = source.readAddress();
    let _includeAddress = source.readBoolean();
    return { $$type: 'ProvideWalletAddress' as const, queryId: _queryId, ownerAddress: _ownerAddress, includeAddress: _includeAddress };
}

function storeTupleProvideWalletAddress(source: ProvideWalletAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.ownerAddress);
    builder.writeBoolean(source.includeAddress);
    return builder.build();
}

function dictValueParserProvideWalletAddress(): DictionaryValue<ProvideWalletAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeProvideWalletAddress(src)).endCell());
        },
        parse: (src) => {
            return loadProvideWalletAddress(src.loadRef().beginParse());
        }
    }
}

export type TakeWalletAddress = {
    $$type: 'TakeWalletAddress';
    queryId: bigint;
    walletAddress: Address;
    ownerAddress: Address | null;
}

export function storeTakeWalletAddress(src: TakeWalletAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3513996288, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.walletAddress);
        b_0.storeAddress(src.ownerAddress);
    };
}

export function loadTakeWalletAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3513996288) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _walletAddress = sc_0.loadAddress();
    let _ownerAddress = sc_0.loadMaybeAddress();
    return { $$type: 'TakeWalletAddress' as const, queryId: _queryId, walletAddress: _walletAddress, ownerAddress: _ownerAddress };
}

function loadTupleTakeWalletAddress(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _walletAddress = source.readAddress();
    let _ownerAddress = source.readAddressOpt();
    return { $$type: 'TakeWalletAddress' as const, queryId: _queryId, walletAddress: _walletAddress, ownerAddress: _ownerAddress };
}

function loadGetterTupleTakeWalletAddress(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _walletAddress = source.readAddress();
    let _ownerAddress = source.readAddressOpt();
    return { $$type: 'TakeWalletAddress' as const, queryId: _queryId, walletAddress: _walletAddress, ownerAddress: _ownerAddress };
}

function storeTupleTakeWalletAddress(source: TakeWalletAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.walletAddress);
    builder.writeAddress(source.ownerAddress);
    return builder.build();
}

function dictValueParserTakeWalletAddress(): DictionaryValue<TakeWalletAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTakeWalletAddress(src)).endCell());
        },
        parse: (src) => {
            return loadTakeWalletAddress(src.loadRef().beginParse());
        }
    }
}

export type GetRoyaltyParams = {
    $$type: 'GetRoyaltyParams';
    queryId: bigint;
}

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadGetRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function loadGetterTupleGetRoyaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, queryId: _queryId };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadGetRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type ReportRoyaltyParams = {
    $$type: 'ReportRoyaltyParams';
    queryId: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.numerator, 16);
        b_0.storeCoins(src.denominator);
        b_0.storeAddress(src.destination);
    };
}

export function loadReportRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    return { $$type: 'ReportRoyaltyParams' as const, queryId: _queryId, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, queryId: _queryId, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleReportRoyaltyParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, queryId: _queryId, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type NFTTransfer = {
    $$type: 'NFTTransfer';
    queryId: bigint;
    newOwner: Address;
    responseDestination: Address;
    customPayload: Cell | null;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
}

export function storeNFTTransfer(src: NFTTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardAmount);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_0.storeBit(true).storeRef(src.forwardPayload); } else { b_0.storeBit(false); }
    };
}

export function loadNFTTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forwardAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NFTTransfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadTupleNFTTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'NFTTransfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleNFTTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    let _forwardAmount = source.readBigNumber();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'NFTTransfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

function storeTupleNFTTransfer(source: NFTTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardAmount);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserNFTTransfer(): DictionaryValue<NFTTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNFTTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadNFTTransfer(src.loadRef().beginParse());
        }
    }
}

export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    queryId: bigint;
    prevOwner: Address;
    forwardPayload: Cell | null;
}

export function storeOwnershipAssigned(src: OwnershipAssigned) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.prevOwner);
        if (src.forwardPayload !== null && src.forwardPayload !== undefined) { b_0.storeBit(true).storeRef(src.forwardPayload); } else { b_0.storeBit(false); }
    };
}

export function loadOwnershipAssigned(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _prevOwner = sc_0.loadAddress();
    let _forwardPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'OwnershipAssigned' as const, queryId: _queryId, prevOwner: _prevOwner, forwardPayload: _forwardPayload };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _prevOwner = source.readAddress();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'OwnershipAssigned' as const, queryId: _queryId, prevOwner: _prevOwner, forwardPayload: _forwardPayload };
}

function loadGetterTupleOwnershipAssigned(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _prevOwner = source.readAddress();
    let _forwardPayload = source.readCellOpt();
    return { $$type: 'OwnershipAssigned' as const, queryId: _queryId, prevOwner: _prevOwner, forwardPayload: _forwardPayload };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.prevOwner);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnershipAssigned(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipAssigned(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    queryId: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function loadTupleGetStaticData(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function loadGetterTupleGetStaticData(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

function storeTupleGetStaticData(source: GetStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    queryId: bigint;
    index: bigint;
    collection: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.index, 256);
        b_0.storeAddress(src.collection);
    };
}

export function loadReportStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _index = sc_0.loadUintBig(256);
    let _collection = sc_0.loadAddress();
    return { $$type: 'ReportStaticData' as const, queryId: _queryId, index: _index, collection: _collection };
}

function loadTupleReportStaticData(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _index = source.readBigNumber();
    let _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, queryId: _queryId, index: _index, collection: _collection };
}

function loadGetterTupleReportStaticData(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _index = source.readBigNumber();
    let _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, queryId: _queryId, index: _index, collection: _collection };
}

function storeTupleReportStaticData(source: ReportStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection);
    return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type GetNftData = {
    $$type: 'GetNftData';
    init: boolean;
    index: bigint;
    collectionAddress: Address;
    ownerAddress: Address;
    individualContent: Cell;
}

export function storeGetNftData(src: GetNftData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.init);
        b_0.storeUint(src.index, 256);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.ownerAddress);
        b_0.storeRef(src.individualContent);
    };
}

export function loadGetNftData(slice: Slice) {
    let sc_0 = slice;
    let _init = sc_0.loadBit();
    let _index = sc_0.loadUintBig(256);
    let _collectionAddress = sc_0.loadAddress();
    let _ownerAddress = sc_0.loadAddress();
    let _individualContent = sc_0.loadRef();
    return { $$type: 'GetNftData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, individualContent: _individualContent };
}

function loadTupleGetNftData(source: TupleReader) {
    let _init = source.readBoolean();
    let _index = source.readBigNumber();
    let _collectionAddress = source.readAddress();
    let _ownerAddress = source.readAddress();
    let _individualContent = source.readCell();
    return { $$type: 'GetNftData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, individualContent: _individualContent };
}

function loadGetterTupleGetNftData(source: TupleReader) {
    let _init = source.readBoolean();
    let _index = source.readBigNumber();
    let _collectionAddress = source.readAddress();
    let _ownerAddress = source.readAddress();
    let _individualContent = source.readCell();
    return { $$type: 'GetNftData' as const, init: _init, index: _index, collectionAddress: _collectionAddress, ownerAddress: _ownerAddress, individualContent: _individualContent };
}

function storeTupleGetNftData(source: GetNftData) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.init);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collectionAddress);
    builder.writeAddress(source.ownerAddress);
    builder.writeCell(source.individualContent);
    return builder.build();
}

function dictValueParserGetNftData(): DictionaryValue<GetNftData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetNftData(src)).endCell());
        },
        parse: (src) => {
            return loadGetNftData(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    nextItemIndex: bigint;
    collectionContent: Cell;
    ownerAddress: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.nextItemIndex, 257);
        b_0.storeRef(src.collectionContent);
        b_0.storeAddress(src.ownerAddress);
    };
}

export function loadCollectionData(slice: Slice) {
    let sc_0 = slice;
    let _nextItemIndex = sc_0.loadIntBig(257);
    let _collectionContent = sc_0.loadRef();
    let _ownerAddress = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, ownerAddress: _ownerAddress };
}

function loadTupleCollectionData(source: TupleReader) {
    let _nextItemIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    let _ownerAddress = source.readAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, ownerAddress: _ownerAddress };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    let _nextItemIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    let _ownerAddress = source.readAddress();
    return { $$type: 'CollectionData' as const, nextItemIndex: _nextItemIndex, collectionContent: _collectionContent, ownerAddress: _ownerAddress };
}

function storeTupleCollectionData(source: CollectionData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.nextItemIndex);
    builder.writeCell(source.collectionContent);
    builder.writeAddress(source.ownerAddress);
    return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type RoyaltyParams = {
    $$type: 'RoyaltyParams';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeRoyaltyParams(src: RoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
        b_0.storeAddress(src.destination);
    };
}

export function loadRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    let _numerator = sc_0.loadIntBig(257);
    let _denominator = sc_0.loadIntBig(257);
    let _destination = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type Tep64TokenData = {
    $$type: 'Tep64TokenData';
    flag: bigint;
    content: string;
}

export function storeTep64TokenData(src: Tep64TokenData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.flag, 8);
        b_0.storeStringRefTail(src.content);
    };
}

export function loadTep64TokenData(slice: Slice) {
    let sc_0 = slice;
    let _flag = sc_0.loadUintBig(8);
    let _content = sc_0.loadStringRefTail();
    return { $$type: 'Tep64TokenData' as const, flag: _flag, content: _content };
}

function loadTupleTep64TokenData(source: TupleReader) {
    let _flag = source.readBigNumber();
    let _content = source.readString();
    return { $$type: 'Tep64TokenData' as const, flag: _flag, content: _content };
}

function loadGetterTupleTep64TokenData(source: TupleReader) {
    let _flag = source.readBigNumber();
    let _content = source.readString();
    return { $$type: 'Tep64TokenData' as const, flag: _flag, content: _content };
}

function storeTupleTep64TokenData(source: Tep64TokenData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.flag);
    builder.writeString(source.content);
    return builder.build();
}

function dictValueParserTep64TokenData(): DictionaryValue<Tep64TokenData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTep64TokenData(src)).endCell());
        },
        parse: (src) => {
            return loadTep64TokenData(src.loadRef().beginParse());
        }
    }
}

export type SetStaticTax = {
    $$type: 'SetStaticTax';
    staticTax: bigint;
}

export function storeSetStaticTax(src: SetStaticTax) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(352953376, 32);
        b_0.storeCoins(src.staticTax);
    };
}

export function loadSetStaticTax(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 352953376) { throw Error('Invalid prefix'); }
    let _staticTax = sc_0.loadCoins();
    return { $$type: 'SetStaticTax' as const, staticTax: _staticTax };
}

function loadTupleSetStaticTax(source: TupleReader) {
    let _staticTax = source.readBigNumber();
    return { $$type: 'SetStaticTax' as const, staticTax: _staticTax };
}

function loadGetterTupleSetStaticTax(source: TupleReader) {
    let _staticTax = source.readBigNumber();
    return { $$type: 'SetStaticTax' as const, staticTax: _staticTax };
}

function storeTupleSetStaticTax(source: SetStaticTax) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.staticTax);
    return builder.build();
}

function dictValueParserSetStaticTax(): DictionaryValue<SetStaticTax> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetStaticTax(src)).endCell());
        },
        parse: (src) => {
            return loadSetStaticTax(src.loadRef().beginParse());
        }
    }
}

export type UpgradeContract = {
    $$type: 'UpgradeContract';
    queryId: bigint;
    code: Cell | null;
    data: Cell | null;
    responseDestination: Address;
}

export function storeUpgradeContract(src: UpgradeContract) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(288003337, 32);
        b_0.storeInt(src.queryId, 257);
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeAddress(src.responseDestination);
    };
}

export function loadUpgradeContract(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 288003337) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _responseDestination = sc_0.loadAddress();
    return { $$type: 'UpgradeContract' as const, queryId: _queryId, code: _code, data: _data, responseDestination: _responseDestination };
}

function loadTupleUpgradeContract(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    let _responseDestination = source.readAddress();
    return { $$type: 'UpgradeContract' as const, queryId: _queryId, code: _code, data: _data, responseDestination: _responseDestination };
}

function loadGetterTupleUpgradeContract(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    let _responseDestination = source.readAddress();
    return { $$type: 'UpgradeContract' as const, queryId: _queryId, code: _code, data: _data, responseDestination: _responseDestination };
}

function storeTupleUpgradeContract(source: UpgradeContract) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeAddress(source.responseDestination);
    return builder.build();
}

function dictValueParserUpgradeContract(): DictionaryValue<UpgradeContract> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpgradeContract(src)).endCell());
        },
        parse: (src) => {
            return loadUpgradeContract(src.loadRef().beginParse());
        }
    }
}

export type MerkleProof = {
    $$type: 'MerkleProof';
    data: Cell;
    root: bigint;
    proof: Dictionary<number, bigint>;
    proofLen: bigint;
}

export function storeMerkleProof(src: MerkleProof) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.data);
        b_0.storeUint(src.root, 256);
        b_0.storeDict(src.proof, Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256));
        b_0.storeUint(src.proofLen, 32);
    };
}

export function loadMerkleProof(slice: Slice) {
    let sc_0 = slice;
    let _data = sc_0.loadRef();
    let _root = sc_0.loadUintBig(256);
    let _proof = Dictionary.load(Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256), sc_0);
    let _proofLen = sc_0.loadUintBig(32);
    return { $$type: 'MerkleProof' as const, data: _data, root: _root, proof: _proof, proofLen: _proofLen };
}

function loadTupleMerkleProof(source: TupleReader) {
    let _data = source.readCell();
    let _root = source.readBigNumber();
    let _proof = Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256), source.readCellOpt());
    let _proofLen = source.readBigNumber();
    return { $$type: 'MerkleProof' as const, data: _data, root: _root, proof: _proof, proofLen: _proofLen };
}

function loadGetterTupleMerkleProof(source: TupleReader) {
    let _data = source.readCell();
    let _root = source.readBigNumber();
    let _proof = Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256), source.readCellOpt());
    let _proofLen = source.readBigNumber();
    return { $$type: 'MerkleProof' as const, data: _data, root: _root, proof: _proof, proofLen: _proofLen };
}

function storeTupleMerkleProof(source: MerkleProof) {
    let builder = new TupleBuilder();
    builder.writeCell(source.data);
    builder.writeNumber(source.root);
    builder.writeCell(source.proof.size > 0 ? beginCell().storeDictDirect(source.proof, Dictionary.Keys.Uint(32), Dictionary.Values.BigUint(256)).endCell() : null);
    builder.writeNumber(source.proofLen);
    return builder.build();
}

function dictValueParserMerkleProof(): DictionaryValue<MerkleProof> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMerkleProof(src)).endCell());
        },
        parse: (src) => {
            return loadMerkleProof(src.loadRef().beginParse());
        }
    }
}

export type JettonFactory$Data = {
    $$type: 'JettonFactory$Data';
    owner: Address;
    seqNo: bigint;
}

export function storeJettonFactory$Data(src: JettonFactory$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.seqNo, 257);
    };
}

export function loadJettonFactory$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _seqNo = sc_0.loadIntBig(257);
    return { $$type: 'JettonFactory$Data' as const, owner: _owner, seqNo: _seqNo };
}

function loadTupleJettonFactory$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _seqNo = source.readBigNumber();
    return { $$type: 'JettonFactory$Data' as const, owner: _owner, seqNo: _seqNo };
}

function loadGetterTupleJettonFactory$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _seqNo = source.readBigNumber();
    return { $$type: 'JettonFactory$Data' as const, owner: _owner, seqNo: _seqNo };
}

function storeTupleJettonFactory$Data(source: JettonFactory$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.seqNo);
    return builder.build();
}

function dictValueParserJettonFactory$Data(): DictionaryValue<JettonFactory$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonFactory$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonFactory$Data(src.loadRef().beginParse());
        }
    }
}

 type JettonMasterTemplate_init_args = {
    $$type: 'JettonMasterTemplate_init_args';
    owner: Address;
    initial_token: bigint;
    max_supply: bigint;
    initial_price: bigint;
    content: Tep64TokenData;
}

function initJettonMasterTemplate_init_args(src: JettonMasterTemplate_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.initial_token, 257);
        b_0.storeInt(src.max_supply, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.initial_price, 257);
        b_1.store(storeTep64TokenData(src.content));
        b_0.storeRef(b_1.endCell());
    };
}

async function JettonMasterTemplate_init(owner: Address, initial_token: bigint, max_supply: bigint, initial_price: bigint, content: Tep64TokenData) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initJettonMasterTemplate_init_args({ $$type: 'JettonMasterTemplate_init_args', owner, initial_token, max_supply, initial_price, content })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const JettonMasterTemplate_errors: { [key: number]: { message: string } } = {
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
    14796: { message: `Exceeds max supply` },
    36477: { message: `insufficient TON received` },
    54227: { message: `Invalid token amount` },
    55591: { message: `Insufficient contract balance` },
}

const JettonMasterTemplate_types: ABIType[] = [
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
    {"name":"LaunchToken","header":1337048928,"fields":[{"name":"content","type":{"kind":"simple","type":"Tep64TokenData","optional":false}}]},
    {"name":"BuyFromPool","header":2563719859,"fields":[{"name":"jettonMasterAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SellFromPool","header":477931964,"fields":[{"name":"jettonMasterAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"JettonMasterTemplate$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"staticTax","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lockedValue","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"max_supply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"initial_price","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"curve_steepness","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"base_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"JettonWalletTemplate$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"staticTax","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lockedValue","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"MintJetton","header":2777909359,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"MultiMint","header":3884814387,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"receivers","type":{"kind":"dict","key":"uint","keyFormat":32,"value":"MultiMintReceiver","valueFormat":"ref"}},{"name":"receiverCount","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"UpdateJettonContent","header":3810709628,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"content","type":{"kind":"simple","type":"Tep64TokenData","optional":false}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonMasterData","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"MultiMintReceiver","header":null,"fields":[{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"BuyToken","header":3344745460,"fields":[{"name":"receiverAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonMasterAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SellToken","header":816927465,"fields":[{"name":"receiverAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenTransferInternal","header":395134233,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TransferNotification","header":1935855772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Burn","header":1499400124,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenBurnNotification","header":2078119902,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ProvideWalletAddress","header":745978227,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"includeAddress","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TakeWalletAddress","header":3513996288,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"walletAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"GetRoyaltyParams","header":1765620048,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportRoyaltyParams","header":2831876269,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"denominator","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"NFTTransfer","header":1607220500,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"OwnershipAssigned","header":85167505,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prevOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetNftData","header":null,"fields":[{"name":"init","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"collectionAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"individualContent","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"nextItemIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collectionContent","type":{"kind":"simple","type":"cell","optional":false}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoyaltyParams","header":null,"fields":[{"name":"numerator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"denominator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Tep64TokenData","header":null,"fields":[{"name":"flag","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"content","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"SetStaticTax","header":352953376,"fields":[{"name":"staticTax","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"UpgradeContract","header":288003337,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"MerkleProof","header":null,"fields":[{"name":"data","type":{"kind":"simple","type":"cell","optional":false}},{"name":"root","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"proof","type":{"kind":"dict","key":"uint","keyFormat":32,"value":"uint","valueFormat":256}},{"name":"proofLen","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"JettonFactory$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"seqNo","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const JettonMasterTemplate_getters: ABIGetter[] = [
    {"name":"currentPrice","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_jetton_data","arguments":[],"returnType":{"kind":"simple","type":"JettonMasterData","optional":false}},
    {"name":"get_wallet_address","arguments":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"tonBalance","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"staticTax","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const JettonMasterTemplate_getterMapping: { [key: string]: string } = {
    'currentPrice': 'getCurrentPrice',
    'get_jetton_data': 'getGetJettonData',
    'get_wallet_address': 'getGetWalletAddress',
    'tonBalance': 'getTonBalance',
    'staticTax': 'getStaticTax',
}

const JettonMasterTemplate_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"BuyToken"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SellToken"}},
    {"receiver":"internal","message":{"kind":"typed","type":"MintJetton"}},
    {"receiver":"internal","message":{"kind":"typed","type":"MultiMint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenBurnNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ProvideWalletAddress"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Excesses"}},
    {"receiver":"internal","message":{"kind":"text","text":"withdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetStaticTax"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class JettonMasterTemplate implements Contract {
    
    static async init(owner: Address, initial_token: bigint, max_supply: bigint, initial_price: bigint, content: Tep64TokenData) {
        return await JettonMasterTemplate_init(owner, initial_token, max_supply, initial_price, content);
    }
    
    static async fromInit(owner: Address, initial_token: bigint, max_supply: bigint, initial_price: bigint, content: Tep64TokenData) {
        const init = await JettonMasterTemplate_init(owner, initial_token, max_supply, initial_price, content);
        const address = contractAddress(0, init);
        return new JettonMasterTemplate(address, init);
    }
    
    static fromAddress(address: Address) {
        return new JettonMasterTemplate(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  JettonMasterTemplate_types,
        getters: JettonMasterTemplate_getters,
        receivers: JettonMasterTemplate_receivers,
        errors: JettonMasterTemplate_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: BuyToken | SellToken | MintJetton | MultiMint | TokenBurnNotification | ProvideWalletAddress | Excesses | 'withdraw' | SetStaticTax | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BuyToken') {
            body = beginCell().store(storeBuyToken(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SellToken') {
            body = beginCell().store(storeSellToken(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'MintJetton') {
            body = beginCell().store(storeMintJetton(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'MultiMint') {
            body = beginCell().store(storeMultiMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenBurnNotification') {
            body = beginCell().store(storeTokenBurnNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ProvideWalletAddress') {
            body = beginCell().store(storeProvideWalletAddress(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Excesses') {
            body = beginCell().store(storeExcesses(message)).endCell();
        }
        if (message === 'withdraw') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetStaticTax') {
            body = beginCell().store(storeSetStaticTax(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getCurrentPrice(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('currentPrice', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getGetJettonData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_jetton_data', builder.build())).stack;
        const result = loadGetterTupleJettonMasterData(source);
        return result;
    }
    
    async getGetWalletAddress(provider: ContractProvider, owner: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(owner);
        let source = (await provider.get('get_wallet_address', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getTonBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('tonBalance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getStaticTax(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('staticTax', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
}