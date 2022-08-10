const networkConfig = {
  default: {
    name: "hardhat",
    VRFCoordinatorAddress: "",
    keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    fee: "100000000000000000", // 0.1 LINK
    subscriptionId: "123456"
  },
  31337: {
    name: "localhost",
    VRFCoordinatorAddress: "",
    keyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    fee: "100000000000000000", // 0.1 LINK
    subscriptionId: "123456"
  },
  // Mainnet
  1: {
    name: "mainnet",
    VRFCoordinatorAddress: "",
    keyHash: "",
    fee: "100000000000000000", // 0.1 LINK
    subscriptionId: ""
  },
  // Kovan
  42: {
    name: "kovan",
    VRFCoordinatorAddress: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    keyHash: "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    fee: "100000000000000000", // 0.1 LINK
    subscriptionId: ""
  },
};

module.exports = {
  networkConfig,
};
