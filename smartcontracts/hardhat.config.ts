require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers")
require("@appliedblockchain/chainlink-plugins-fund-link");
require("hardhat-deploy");
require("./tasks/createLottery");
require("./tasks/participate");

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    kovan: {
      url: process.env.KOVAN_URL,
      chainId: 42,
      // @ts-ignore
      accounts: [
        process.env.PRIVATE_KEY_DEPLOYER,
        process.env.PRIVATE_KEY_USER1,
        process.env.PRIVATE_KEY_USER2
      ].filter(
        x => x !== undefined
      )
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: !!(process.env.REPORT_GAS)
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user1: {
      default: 1,
      4: 1
    },
    user2: {
      default: 2,
      4: 2
    }
  }
};

export default config;
