const {BigNumber} = require("ethers");
const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  let
    linkTokenAddress,
    VRFCoordinatorAddress,
    keyHash,
    fee
  ;

  if (chainId === 31337) {
    const LinkTokenMock = await get("LinkToken");
    const VRFCoordinatorMock = await get("VRFCoordinatorMock");

    linkTokenAddress = LinkTokenMock.address;
    VRFCoordinatorAddress = VRFCoordinatorMock.address;
  } else {
    linkTokenAddress = networkConfig[chainId].linkTokenAddress;
    VRFCoordinatorAddress = networkConfig[chainId].VRFCoordinatorAddress;
  }

  keyHash = networkConfig[chainId].keyHash;
  fee = networkConfig[chainId].fee;

  // const keyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
  // const fee = "1000000000000000000" // 0.1 LINK

  const lottery = await deploy("LotteryGame", {
    from: deployer,
    args: [
      VRFCoordinatorAddress,
      linkTokenAddress,
      keyHash,
      BigNumber.from(fee)
    ],
    log: true,
  });

  log("----------------------------------------------------");
  log("Run the following command to fund contract with LINK:");
  log(
    'npx hardhat fund-link' +
    ` --contract ${lottery.address}` +
    ` --linkaddress ${linkTokenAddress}` +
    ` --fundamount ${networkConfig[chainId].fundAmount}` +
    ` --network ${networkConfig[chainId].name}`
  );
};

module.exports.tags = ["all", "test"];
