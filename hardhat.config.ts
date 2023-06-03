import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import rpc from './rpc.json'
require('dotenv').config();

const {
  PRIVATE_KEY,
  API_KEY_MUMBAI,
  API_KEY_ARBITRUM,
  API_KEY_BSCTESTNET,
  API_KEY_BSCSCAN,
} = process.env;

const config: HardhatUserConfig = {

  networks: {
    hardhat: {
    },
    mumbai: {
      url: rpc.mumbai,
      accounts: [PRIVATE_KEY as string]
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
      accounts: [PRIVATE_KEY as string]
    },
    bscscan: {
      url: "https://bsc-dataseed1.binance.org/",
      // accounts: [PRIVATE_KEY_BSCSCAN_TEST]
      accounts: [PRIVATE_KEY as string]
    },
    avalanchetestnet: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY as string]
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc/",
      accounts: [PRIVATE_KEY as string]
    },
    dev: {
      url: "http://127.0.0.1:7545",
      accounts: [PRIVATE_KEY as string]
    },
  },

  etherscan: {
    apiKey: {
      bsc: API_KEY_BSCSCAN as string,
      bscTestnet: API_KEY_BSCTESTNET as string,
      polygonMumbai: API_KEY_MUMBAI as string,
      arbitrumOne: API_KEY_ARBITRUM as string,
    }
  },

  solidity: "0.8.18",
};



export default config;
