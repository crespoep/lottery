require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@appliedblockchain/chainlink-plugins-fund-link";
import "hardhat-deploy";
import "./tasks/createLottery";
import "./tasks/participate";

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
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      chainId: 80001,
      // @ts-ignore
      accounts: [
        process.env.PRIVATE_KEY_DEPLOYER,
        process.env.PRIVATE_KEY_USER_1,
        process.env.PRIVATE_KEY_USER_2,
      ].filter((x) => x !== undefined),
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
    },
    user3: {
      default: 3,
      4: 3
    }
  }
};

export default config;
