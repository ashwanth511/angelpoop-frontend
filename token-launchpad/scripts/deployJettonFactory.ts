import { toNano } from '@ton/core';
import { JettonFactory } from '../wrappers/JettonFactory';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // const jettonMaster = provider.open(await JettonFactory.fromInit());
    // await jettonMaster.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: 'Deploy',
    //         queryId: 0n,
    //     },
    // );
    // await provider.waitForDeploy(jettonMaster.address);
    // run methods on `jettonMaster`
}
