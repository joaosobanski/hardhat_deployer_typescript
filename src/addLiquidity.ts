import Web3 from 'web3';
import logger from './utils/logger';
import { signTx } from './sign';
import getConfig from './config';
require('dotenv').config();

const {
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

async function addLiquidity() {

    const config = getConfig(80001);
    if (!config)
        return;

    const web3 = new Web3(config.rpc);

    const token = config.usdt
    let amountETH = '10'
    amountETH = web3.utils.toWei(amountETH, 'ether')

    const tokenContract = new web3.eth.Contract(require('./abi/token.json'), token);
    const wethContract = new web3.eth.Contract(require('./abi/weth.json'), config.weth);
    const routerContract = new web3.eth.Contract(require('./abi/router.json'), config.router);
    const factoryContract = new web3.eth.Contract(require('./abi/factory.json'), config.factory);

    const balanceWETH = await wethContract.methods.balanceOf(PUBLIC_KEY).call();

    if (Number(balanceWETH) <= 0 || Number(balanceWETH) < Number(amountETH)) {
        logger.error(`Insufficient eth ${web3.utils.fromWei(balanceWETH, 'ether')}`);
        return;
    }

    // const txPair = await factoryContract.methods.createPair(token, config.weth)

    // await signTx(web3, config.factory, txPair, PUBLIC_KEY as string, PRIVATE_KEY as string)
    //     .then((e: any) => logger.info(`${config.explorer}/tx/${e.transactionHash}`));

    logger.info("getting balance")
    const balanceToken = await tokenContract.methods.balanceOf(PUBLIC_KEY).call();
    logger.info({ balanceToken }, "balance token")
    logger.info({ amountETH }, "balance weth")

    logger.info("approving token")
    let tx = await tokenContract.methods.approve(config.router, balanceToken);
    await signTx(web3, token, tx, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`approved ${web3.utils.fromWei(balanceToken, 'ether')} Token\n${config.explorer}/tx/${e.transactionHash}`))

    logger.info("approving weth")
    tx = await wethContract.methods.approve(config.router, amountETH)
    await signTx(web3, config.weth, tx, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`approved ${web3.utils.fromWei(amountETH, 'ether')} WETH\n${config.explorer}/tx/${e.transactionHash}`))

    console.log('add liquidity')
    const liquidity = await routerContract.methods.addLiquidity(
        token,
        config.weth,
        balanceToken,
        amountETH,
        0,
        0,
        PUBLIC_KEY,
        99999999999);

    await signTx(web3, config.router, liquidity, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`${config.explorer}/tx/${e.transactionHash}`));

}

addLiquidity();
