module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const linkTokenMock = await deploy("LinkToken", {
    from: deployer,
    log: true,
  });

  await deploy("VRFCoordinatorMock", {
    from: deployer,
    log: true,
    args: [linkTokenMock.address],
  });

};

module.exports.tags = ["all", "test"];
