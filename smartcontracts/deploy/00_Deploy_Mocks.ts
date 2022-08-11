import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { network } from "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const { chainId } = network.config;

  const BASE_FEE = "250000000000000000" // 0.25
  const GAS_PRICE_LINK = 1e9

  if (chainId === 31337) {
    log("Using Hardhat network, deploying mocks...");

    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [
        BASE_FEE,
        GAS_PRICE_LINK
      ],
    });

    log("Mocks were deployed");
    log("----------------------------------------------------");
  }
};
export default func;
func.tags = ["all", "test"];
