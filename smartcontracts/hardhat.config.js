require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@appliedblockchain/chainlink-plugins-fund-link");
require("./tasks/createLottery");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
};
