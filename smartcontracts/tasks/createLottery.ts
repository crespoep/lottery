import {HardhatRuntimeEnvironment} from "hardhat/types";
import { task } from "hardhat/config";

task("create-lottery", "Create new lottery")
  .addParam("ticket", "Ticket price to participate in the lottery")
  .addParam("duration", "Lottery duration")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const ethers = hre.ethers

    const Lottery = await hre.deployments.get("LotteryGame");
    const lotteryContract = await hre.ethers.getContractAt(
      "LotteryGame",
      Lottery.address
    );

    const duration = taskArgs.duration;
    const ticket = taskArgs.ticket;

    const transaction = await lotteryContract.createLottery(
      ethers.BigNumber.from(ticket),
      parseInt(duration)
    );

    const receipt = await transaction.wait()

    console.log(receipt)
    console.log("Transaction Mined. Lottery created successfully");
  });

module.exports = {};
