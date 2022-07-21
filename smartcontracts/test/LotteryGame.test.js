const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe('LotteryGame', () => {
  const ONE_ETHER = ethers.constants.WeiPerEther;
  const DURATION_IN_SECONDS = 60;

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
      let lotteryId = await lotteryContract.lotteryId();
      expect(lotteryId).to.equal(0);

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);

      lotteryId = await lotteryContract.lotteryId();
      expect(lotteryId).to.equal(1);
    });

    it('should set the current id correctly', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const lottery = await lotteryContract.getLottery(1);

      expect(lottery.id).to.equal("1");
    });

    it('should have the correct required ticket price', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const lottery = await lotteryContract.getLottery(1);

      expect(lottery.ticket).to.equal(ONE_ETHER);
    });

    it('should have the correct required duration', async () => {
      const transaction = await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const transactionReceipt = await transaction.wait();
      const blockNumber = transactionReceipt.blockNumber;

      const lottery = await lotteryContract.getLottery(1);

      const timestamp = (await ethers.provider.getBlock(blockNumber)).timestamp;

      expect(lottery.endTime).to.equal(timestamp + DURATION_IN_SECONDS);
    });

    it("should not have any participants at first", async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.participants).to.be.an("array");
      expect(lottery.participants).to.have.lengthOf(0);
    });
  })

  it('should return the correct open lotteries ids', async () => {
    let openLotteriesIds = await lotteryContract.getOpenLotteriesIds();

    expect(openLotteriesIds).to.be.an("array");
    expect(openLotteriesIds).to.have.lengthOf(0);

    await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
    openLotteriesIds = await lotteryContract.getOpenLotteriesIds()

    expect(openLotteriesIds).to.be.an("array");
    expect(openLotteriesIds).to.have.lengthOf(1);
    expect(openLotteriesIds[0]).to.equal(1);
  });

  describe('participation', () => {
    it('should be reverted when trying to participate without exact payment', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      await expect(lotteryContract.participate(1))
        .to.be.revertedWith("The ticket payment should be exact");
      await expect(
        lotteryContract.participate(1, {
          value: ethers.utils.parseEther("1.1"),
        })
      ).to.be.revertedWith("The ticket payment should be exact");
      await expect(
        lotteryContract.participate(1, {
          value: ethers.utils.parseEther("0.9"),
        })
      ).to.be.revertedWith("The ticket payment should be exact");
    });

    it('should be reverted when trying to participate in an nonexistent lottery', async () => {
      await expect(lotteryContract.participate(1))
        .to.be.revertedWith("The lottery does not exist");
    });
  })
})
