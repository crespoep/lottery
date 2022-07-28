const networkConfig = {
  default: {
    name: "hardhat",
    linkTokenAddress: "",
    VRFCoordinatorAddress: "",
    keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    fee: "100000000000000000", // 0.1 LINK
    fundAmount: "100000000000000000", // 0.1 LINK
  },
  31337: {
    name: "localhost",
    linkTokenAddress: "",
    VRFCoordinatorAddress: "",
    keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    fee: "100000000000000000", // 0.1 LINK
    fundAmount: "100000000000000000", // 0.1 LINK
  },
  // Mainnet
  1: {
    name: "mainnet",
    linkTokenAddress: "",
    VRFCoordinatorAddress: "",
    keyHash: "",
    fee: "100000000000000000", // 0.1 LINK
    fundAmount: "100000000000000000", // 0.1 LINK
  },
  // Kovan
  42: {
    name: "kovan",
    linkTokenAddress: "0xa36085F69e2889c224210F603D836748e7dC0088",
    VRFCoordinatorAddress: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    keyHash: "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    fee: "100000000000000000", // 0.1 LINK
    fundAmount: "100000000000000000", // 0.1 LINK
  },
};

module.exports = {
  networkConfig,
};