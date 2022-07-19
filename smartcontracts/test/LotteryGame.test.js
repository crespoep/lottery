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
})
