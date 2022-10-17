const networkConfig = {
  default: {
    name: "hardhat",
    VRFCoordinatorAddress: "",
    keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    subscriptionId: "123456"
  },
  31337: {
    name: "localhost",
    VRFCoordinatorAddress: "",
    keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    subscriptionId: "123456"
  },
  // Mainnet
  1: {
    name: "mainnet",
    VRFCoordinatorAddress: "",
    keyHash: "",
    subscriptionId: ""
  },
  // Mumbai
  80001: {
    name: "mumbai",
    VRFCoordinatorAddress: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    subscriptionId: process.env.TESTNET_SUBSCRIPTION_ID
  }
};

module.exports = {
  networkConfig,
};
