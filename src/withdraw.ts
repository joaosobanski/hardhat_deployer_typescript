import Web3 from 'web3';
import rpc from '../rpc.json'
import Address from '../address.json'
import logger from './utils/logger';
require('dotenv').config();

const {
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

async function withdraw() {

    const address = Address.mumbai

    const web3 = new Web3(rpc.mumbai.rpc);
    const wethContract = new web3.eth.Contract(require('./abi/weth.json'), address.weth);

    const balanceWETH = await wethContract.methods.balanceOf(PUBLIC_KEY).call();

    if (Number(balanceWETH) <= 0) {
        logger.error('Insufficient eth');
        return;
    }

    var tx = wethContract.methods.withdraw(balanceWETH);
    const networkId = await web3.eth.net.getId();

    let gas;
    try {
        gas = await tx.estimateGas({ from: PUBLIC_KEY });
    }
    catch {
        gas = 1000000
    }

    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY as string);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: address.weth,
            data,
            gas: gas,
            gasPrice,
            nonce,
            chainId: networkId
        },
        PRIVATE_KEY as string
    );
    if (signedTx)
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction as string)
            .then(e => logger.info(`Withdraw ${web3.utils.fromWei(balanceWETH, 'ether')} ETH\n${rpc.mumbai.explorer}/tx/${e.transactionHash}`))
    else
        logger.error("fail on withdraw!")

}

withdraw();
