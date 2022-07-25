const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

const prepareForFundingWithLink =
  (contractAddress, linkTokenAddress) => async () => {
    await hre.run("fund-link", {
      contract: contractAddress,
      linkaddress: linkTokenAddress,
    });
  };

const increaseTime = async (seconds) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
}

describe('LotteryGame', () => {
  const ONE_ETHER = ethers.constants.WeiPerEther;
  const DURATION_IN_SECONDS = 60;

  let
    deployer,
    user1,
    LotteryGame,
    lotteryContract,
    LinkToken,
    linkTokenContract,
    VRFCoordinator,
    vrfCoordinatorContract,
    fundWithLink
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    [deployer, user1] = await ethers.getSigners();

    LotteryGame = await deployments.get("LotteryGame");
    LinkToken = await deployments.get("LinkToken");
    VRFCoordinator = await deployments.get("VRFCoordinatorMock");

    lotteryContract = await ethers.getContractAt("LotteryGame", LotteryGame.address);
    linkTokenContract = await ethers.getContractAt("LinkToken", LinkToken.address);
    vrfCoordinatorContract = await ethers.getContractAt("VRFCoordinatorMock", VRFCoordinator.address);

    fundWithLink = prepareForFundingWithLink(
      lotteryContract.address,
      linkTokenContract.address
    );
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

    it("should add a new user to the lottery correctly", async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER };
      await lotteryContract.participate(1, options);
      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.participants[0]).to.equal(deployer.address);
    });

    it("should increment the jackpot correctly", async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER };

      let lottery = await lotteryContract.getLottery(1);
      expect(lottery.jackpot).to.equal(0);

      await lotteryContract.participate(1, options);
      lottery = await lotteryContract.getLottery(1);
      expect(lottery.jackpot).to.equal(ONE_ETHER);
    });
  })

  describe("declare winner", async () => {
    it("should be reverted if the finalization time has not come yet", async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWith("The lottery has not finished yet")
    });

    it("should be reverted if game that does not exist", async () => {
      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWith("The lottery does not exist");
    });

    it('requests a random number to the VRF coordinator', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);

      await increaseTime(DURATION_IN_SECONDS);

      await expect(lotteryContract.declareWinner(1))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('selects a winner', async () => {
      const RANDOM_NUMBER = 5;

      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await increaseTime(DURATION_IN_SECONDS);

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER,
        lotteryContract.address
      )).to.emit(
        lotteryContract,
        "WinnerDeclared"
      ).withArgs(1, user1.address);

      const lottery = await lotteryContract.getLottery(1)
      expect(lottery.winner).to.equal(user1.address)
    });
  })
})
