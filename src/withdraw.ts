import Web3 from 'web3';
import logger from './utils/logger';
import getConfig from './config';
require('dotenv').config();

const {
    PUBLIC_KEY,
    PRIVATE_KEY
} = process.env

async function withdraw() {

    const config = getConfig(80001);
    if (!config)
        return;


    const web3 = new Web3(config.rpc);
    const wethContract = new web3.eth.Contract(require('./abi/weth.json'), config.weth);

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
            to: config.weth,
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
            .then(e => logger.info(`Withdraw ${web3.utils.fromWei(balanceWETH, 'ether')} ETH
            \n${config.explorer}/tx/${e.transactionHash}`))
    else
        logger.error("fail on withdraw!")

}

withdraw();
