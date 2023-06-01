import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
require('dotenv').config();

const {
  PRIVATE_KEY_LOCAL,
  PRIVATE_KEY,
  PRIVATE_KEY_ARBITRUM,
  API_KEY_MUMBAI,
  API_KEY_ARBITRUM,
  API_KEY_BSCTESTNET,
  PRIVATE_KEY_BSCSCAN,
  API_KEY_BSCSCAN,
  PRIVATE_KEY_BSCSCAN_TEST,
} = process.env;

const config: HardhatUserConfig = {

  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [PRIVATE_KEY as string]
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
      accounts: [PRIVATE_KEY as string]
    },
    bscscan: {
      url: "https://bsc-dataseed1.binance.org/",
      // accounts: [PRIVATE_KEY_BSCSCAN_TEST]
      accounts: [PRIVATE_KEY_BSCSCAN as string]
    },
    avalanchetestnet: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY as string]
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc/",
      accounts: [PRIVATE_KEY_ARBITRUM as string]
    },
    dev: {
      url: "http://127.0.0.1:7545",
      accounts: [PRIVATE_KEY_LOCAL as string]
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
