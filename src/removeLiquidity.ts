import Web3 from 'web3';
import logger from './utils/logger';
import { signTx } from './sign';
import getConfig from './config';
require('dotenv').config();

const {
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

async function removeLiquidity() {

    const config = getConfig(80001);
    if (!config)
        return;

    const web3 = new Web3(config.rpc);

    const token = config.usdt

    const routerContract = new web3.eth.Contract(require('./abi/router.json'), config.router);
    const factoryContract = new web3.eth.Contract(require('./abi/factory.json'), config.factory);

    let pairAddress = await factoryContract.methods.getPair(config.weth, token).call()

    console.log(pairAddress)

    const pairContract = new web3.eth.Contract(require('./abi/pair.json'), pairAddress);

    const myBalanceLP = await pairContract.methods.balanceOf(PUBLIC_KEY).call();

    console.log(`approval LP ${web3.utils.fromWei(myBalanceLP, 'ether')} Tokens from router`)
    let tx = await pairContract.methods.approve(config.router, myBalanceLP);

    await signTx(web3, pairAddress, tx, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`${config.explorer}/tx/${e.transactionHash}`));

    const liquidity = await routerContract.methods.removeLiquidity(
        config.weth,
        token,
        myBalanceLP,
        0,
        0,
        PUBLIC_KEY,
        99999999999);

    await signTx(web3, config.router, liquidity, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`${config.explorer}/tx/${e.transactionHash}`));

}

removeLiquidity();
