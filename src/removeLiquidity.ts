import Web3 from 'web3';
import rpc from '../rpc.json'
import Address from '../address.json'
import logger from './utils/logger';
import { signTx } from './sign';
require('dotenv').config();

const {
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

async function removeLiquidity() {

    const web3 = new Web3(rpc.fuji.rpc);
    const address = Address.mumbai

    const token = address.usdt

    const routerContract = new web3.eth.Contract(require('./abi/router.json'), address.router);
    const factoryContract = new web3.eth.Contract(require('./abi/factory.json'), address.factory);

    let pairAddress = await factoryContract.methods.getPair(address.weth, token).call()

    console.log(pairAddress)
    return;

    const pairContract = new web3.eth.Contract(require('./abi/pair.json'), pairAddress);

    const myBalanceLP = await pairContract.methods.balanceOf(PUBLIC_KEY).call();

    console.log(`approval LP ${web3.utils.fromWei(myBalanceLP, 'ether')} Tokens from router`)
    let tx = await pairContract.methods.approve(address.router, myBalanceLP);

    await signTx(web3, pairAddress, tx, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`${rpc.mumbai.explorer}/tx/${e.transactionHash}`));

    const liquidity = await routerContract.methods.removeLiquidity(
        address.weth,
        token,
        myBalanceLP,
        0,
        0,
        PUBLIC_KEY,
        99999999999);

    await signTx(web3, address.router, liquidity, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`${rpc.mumbai.explorer}/tx/${e.transactionHash}`));

}

removeLiquidity();
