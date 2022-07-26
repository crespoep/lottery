
task("participate", "Participate in a lottery")
  .addParam("lotteryid", "Lottery id")
  .addParam("user", "User address")
  .addParam("ticket", "Payment to participate in the lottery")
  .setAction(async (taskArgs, hre) => {
    const Lottery = await deployments.get("LotteryGame");
    const lottery = await ethers.getContractAt(
      "LotteryGame",
      Lottery.address
    );

    const provider = new ethers.providers.JsonRpcProvider
    const signer = provider.getSigner(taskArgs.user)

    const lotteryId = taskArgs.lotteryid;
    const ticket = taskArgs.ticket;
    
    await lottery.connect(signer).participate(
      parseInt(lotteryId),
      {
          value: ticket,
      }
    );

    console.log(`Transaction Mined. User ${taskArgs.user} has participated`);
  });

module.exports = {};
