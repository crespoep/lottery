const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");

const prepareForFundingWithLink =
  (contractAddress, linkTokenAddress) => async () => {
    await hre.run("fund-link", {
      contract: contractAddress,
      linkaddress: linkTokenAddress,
    });
  };

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
    it('should be reverted if ticket price is not greater than zero', async () => {
      const invalidTicketPrice = 0;
      await expect(
        lotteryContract.createLottery(invalidTicketPrice, DURATION_IN_SECONDS)
      ).to.be.revertedWith("Ticket price must be greater than zero");
    });

    it('should be reverted if duration is less than 60 seconds', async () => {
      const invalidDuration = 50;
      await expect(
        lotteryContract.createLottery(ONE_ETHER, invalidDuration)
      ).to.be.revertedWith("Lottery duration cannot be less than a minute");
    });

    it('should be reverted if anyone other than the admin tries to create a lottery', async () => {
      await expect(
        lotteryContract.connect(user1).createLottery(ONE_ETHER, DURATION_IN_SECONDS)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

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

    it('should have open state', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(0);
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

    it('should be reverted when users try to participate twice', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER };
      await lotteryContract.participate(1, options);
      await expect(lotteryContract.participate(1, options)).to.be.revertedWith("User already participated")
    });

    it('should be reverted when users try to participate if lottery is not open anymore', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER };
      await lotteryContract.participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      await lotteryContract.declareWinner(1)

      await expect(
        lotteryContract.connect(user1).participate(1, options)
      ).to.be.revertedWith("Lottery is closed to new participants");
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

      await helpers.time.increase(DURATION_IN_SECONDS)

      await expect(lotteryContract.declareWinner(1))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('changes lottery state to closed', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      await lotteryContract.declareWinner(1);

      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(1)
    });

    it('selects a winner', async () => {
      const RANDOM_NUMBER = 5;

      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

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

    it('transfer the jackpot to the winner', async () => {
      const RANDOM_NUMBER = 5;

      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(await vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER,
        lotteryContract.address
      )).to.changeEtherBalance(
        user1,
        ONE_ETHER.mul(2)
      );
    });

    it('changes lottery state to WINNER_DECLARED when there is a winner', async () => {
      const RANDOM_NUMBER = 5;

      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(await vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER,
        lotteryContract.address
      ))

      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(2)
    });
  })

  describe("keeper", async () => {
    it('checkUpkeep should return false when there is no open lotteries', async () => {
      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.false
      expect(upkeepNeeded[1]).to.equal("0x");
    });

    it('checkUpkeep should return false when there is an open lottery but the end time has not come yet', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.false
      expect(upkeepNeeded[1]).to.equal("0x");
    });

    it('checkUpkeep should return true and lottery id when there is an open lottery and the end time has come', async () => {
      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.true
      expect(BigNumber.from(upkeepNeeded[1])).to.equal("1");
    });

    it('performUpkeep should call declare winner if conditions are met', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(lotteryContract.performUpkeep(upkeepNeeded[1]))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('checkUpkeep should return false for a lottery if its end time has come but its state is closed', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(ONE_ETHER, DURATION_IN_SECONDS);
      const options = { value: ONE_ETHER }
      await lotteryContract.participate(1, options);
      await lotteryContract.connect(user1).participate(1, options);

      await helpers.time.increase(DURATION_IN_SECONDS)

      let upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(upkeepNeeded[0]).to.be.true

      await expect(lotteryContract.performUpkeep(upkeepNeeded[1]))

      upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(upkeepNeeded[0]).to.be.false
    });
  })
})
