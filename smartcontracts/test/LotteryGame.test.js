const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe('LotteryGame', () => {
  let
    LotteryGame,
    lotteryContract
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);
    LotteryGame = await deployments.get("LotteryGame");
    lotteryContract = await ethers.getContractAt("LotteryGame", LotteryGame.address);
  })

  it('is deployed successfully', async () => {
    const address = await lotteryContract.address;

    expect(address).not.to.equal(null);
    expect(address).not.to.equal(0x0);
    expect(address).not.to.equal("");
    expect(address).not.to.equal(undefined);
  });

  describe('game creation', async () => {
    it('increments the number of games', async () => {
      let num = await lotteryContract.lotteryId();
      expect(num).to.equal(0);

      await lotteryContract.createLottery();

      num = await lotteryContract.lotteryId();
      expect(num).to.equal(1);
    });

    it('should set the current id correctly', async () => {
      await lotteryContract.createLottery();
      const lottery = await lotteryContract.getLottery(1);

      expect(lottery.id).to.equal("1");
    });
  })
})
