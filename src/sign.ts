import Web3 from "web3";
import logger from "./utils/logger";

export async function signTx(web3: Web3, address: string, tx: any, PUBLIC_KEY: string, PRIVATE_KEY: string) {

    let gas = 100000;
    try {
        gas = await tx.estimateGas({ from: PUBLIC_KEY });
    }
    catch {
        gas = 1000000
    }

    const gasPrice = await web3.eth.getGasPrice();
    const chainId = await web3.eth.getChainId();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY as string);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: address,
            data,
            gas: gas,
            gasPrice,
            nonce,
            chainId: chainId
        },
        PRIVATE_KEY as string
    );
    if (signedTx)
        return await web3.eth.sendSignedTransaction(signedTx.rawTransaction as string)
    else
        logger.error("fail on withdraw!")
    return
}

