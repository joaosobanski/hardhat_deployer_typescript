import Web3 from 'web3';
import rpc from '../rpc.json'
import Address from '../address.json'
import logger from './utils/logger';
require('dotenv').config();

const {
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

async function wrap() {

    const address = Address.mumbai
    const web3 = new Web3(rpc.mumbai.rpc);
    const wethContract = new web3.eth.Contract(require('./abi/weth.json'), address.weth);

    const balance = await web3.eth.getBalance(PUBLIC_KEY as string);

    if (Number(balance) <= 0) {
        logger.error('Insufficient eth');
        return;
    }

    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY as string);
    const wrap_amount = '10'
    const tx = {
        from: PUBLIC_KEY as string,
        to: address.weth,
        nonce: nonce,
        gas: "500000",
        value: web3.utils.toWei(wrap_amount, `ether`),
        data: wethContract.methods.deposit().encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY as string);

    if (signedTx)
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction as string)
            .then(e => logger.info(`Withdraw ${wrap_amount} ETH\n ${rpc.mumbai.explorer}/tx/${e.transactionHash}`))

    else
        logger.error("fail on wrap!")
}

wrap();
