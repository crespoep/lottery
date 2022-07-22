const {BigNumber} = require("ethers");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const LinkTokenMock = await get("LinkToken");
  const VRFCoordinatorMock = await get("VRFCoordinatorMock");

  const linkTokenAddress = LinkTokenMock.address;
  const VRFCoordinatorAddress = VRFCoordinatorMock.address;

  const keyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
  const fee = "1000000000000000000" // 0.1 LINK

  await deploy("LotteryGame", {
    from: deployer,
    args: [
      VRFCoordinatorAddress,
      linkTokenAddress,
      keyHash,
      BigNumber.from(fee)
    ],
    log: true,
  });
};

module.exports.tags = ["all", "test"];
