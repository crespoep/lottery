const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  if (chainId === 31337) {
    log("Using Hardhat network, deploying mocks...");

    const linkTokenMock = await deploy("LinkToken", {
      from: deployer,
      log: true,
    });

    await deploy("VRFCoordinatorMock", {
      from: deployer,
      log: true,
      args: [linkTokenMock.address],
    });

    log("Mocks were deployed");
    log("----------------------------------------------------");
  }
};

module.exports.tags = ["all", "test"];
