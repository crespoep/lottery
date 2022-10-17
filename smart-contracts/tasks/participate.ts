import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";

task("participate", "Participate in a lottery")
  .addParam("contract", "LotteryGame contract address")
  .addParam("lotteryid", "Lottery id")
  .addParam("user", "User address")
  .addParam( "ticket", "Payment to participate in the lottery")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const ethers = hre.ethers

    const lottery = await ethers.getContractAt(
      "LotteryGame",
      taskArgs.contract
    );

    const provider = new ethers.providers.JsonRpcProvider
    const signer = provider.getSigner(taskArgs.user)

    const lotteryId = taskArgs.lotteryid;
    const ticket = taskArgs.ticket;

    const tx = await lottery.connect(signer).participate(
      parseInt(lotteryId),
      {
          value: ticket,
      }
    );

    const receipt = await tx.wait()

    console.log(receipt)
    console.log(`Transaction Mined. User ${taskArgs.user} has participated`);
  });

module.exports = {};
