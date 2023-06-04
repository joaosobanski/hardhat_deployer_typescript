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

async function addLiquidity() {

    const web3 = new Web3(rpc.fuji.rpc);
    const address = Address.mumbai

    const token = address.usdt
    let amountETH = '0.01'
    amountETH = web3.utils.toWei(amountETH, 'ether')

    const tokenContract = new web3.eth.Contract(require('./abi/token.json'), token);
    const wethContract = new web3.eth.Contract(require('./abi/weth.json'), address.weth);
    const routerContract = new web3.eth.Contract(require('./abi/router.json'), address.router);
    const factoryContract = new web3.eth.Contract(require('./abi/factory.json'), address.factory);

    const balanceWETH = await wethContract.methods.balanceOf(PUBLIC_KEY).call();

    if (Number(balanceWETH) <= 0 || Number(balanceWETH) < Number(amountETH)) {
        logger.error(`Insufficient eth ${web3.utils.fromWei(balanceWETH, 'ether')}`);
        return;
    }

    // const txPair = await factoryContract.methods.createPair(token, address.weth)

    // await signTx(web3, address.factory, txPair, PUBLIC_KEY as string, PRIVATE_KEY as string)
    //     .then((e: any) => logger.info(`${rpc.mumbai.explorer}/tx/${e.transactionHash}`));

    logger.info("getting balance")
    const balanceToken = await tokenContract.methods.balanceOf(PUBLIC_KEY).call();
    logger.info({ balanceToken }, "balance token")
    logger.info({ amountETH }, "balance weth")

    logger.info("approving")
    let tx = await tokenContract.methods.approve(address.router, balanceToken);
    await signTx(web3, token, tx, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`approved ${web3.utils.fromWei(balanceToken, 'ether')} Token\n${rpc.mumbai.explorer}/tx/${e.transactionHash}`))

    logger.info("approving")
    tx = await wethContract.methods.approve(address.router, amountETH)
    await signTx(web3, address.weth, tx, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`approved ${web3.utils.fromWei(amountETH, 'ether')} WETH\n${rpc.mumbai.explorer}/tx/${e.transactionHash}`))

    console.log('add')
    const liquidity = await routerContract.methods.addLiquidity(
        token,
        address.weth,
        balanceToken,
        amountETH,
        0,
        0,
        PUBLIC_KEY,
        99999999999);

    await signTx(web3, address.router, liquidity, PUBLIC_KEY as string, PRIVATE_KEY as string)
        .then((e: any) => logger.info(`${rpc.mumbai.explorer}/tx/${e.transactionHash}`));

    // tx = wethContract.methods.withdraw(balanceWETH);
    // const networkId = await web3.eth.net.getId();


}

addLiquidity();
