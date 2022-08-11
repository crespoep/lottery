import {HardhatRuntimeEnvironment} from "hardhat/types";

import { BigNumber } from "ethers";
import { DeployFunction } from "hardhat-deploy/dist/types";
const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy, get, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
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

export default func;
func.tags = ["all", "test"];
