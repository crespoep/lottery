const {BigNumber} = require("ethers");
const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  let
    VRFCoordinatorAddress,
    subscriptionId
  ;

  if (chainId === 31337) {
    const VRFCoordinatorMock = await get("VRFCoordinatorV2Mock");

    VRFCoordinatorAddress = VRFCoordinatorMock.address;
    subscriptionId = 1;
  } else {
    VRFCoordinatorAddress = networkConfig[chainId].VRFCoordinatorAddress;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  const keyHash = networkConfig[chainId].keyHash;
  const fee = networkConfig[chainId].fee;


  await deploy("LotteryGame", {
    from: deployer,
    args: [
      VRFCoordinatorAddress,
      keyHash,
      BigNumber.from(fee),
      subscriptionId
    ],
    log: true,
  });

  log("----------------------------------------------------");
};

module.exports.tags = ["all", "test"];
