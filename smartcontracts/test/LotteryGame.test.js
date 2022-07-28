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
  const TICKET_PRICE = ethers.constants.WeiPerEther;
  const DURATION = 60;
  const RANDOM_NUMBER_EXAMPLE = 5;
  const OPTIONS = { value: TICKET_PRICE };

  let
    deployer,
    user1,
    user2,
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

    [deployer, user1, user2] = await ethers.getSigners();

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
        lotteryContract.createLottery(invalidTicketPrice, DURATION)
      ).to.be.revertedWith("TicketPriceNotGreaterThanZero()");
    });

    it('should be reverted if duration is less than 60 seconds', async () => {
      const invalidDuration = 50;
      await expect(
        lotteryContract.createLottery(TICKET_PRICE, invalidDuration)
      ).to.be.revertedWith("LotteryDurationNotEnough()");
    });

    it('should be reverted if anyone other than the admin tries to create a lottery', async () => {
      await expect(
        lotteryContract.connect(user1).createLottery(TICKET_PRICE, DURATION)
      ).to.be.revertedWith("CallerIsNotTheOwner()");
    });

    it('increments the number of games', async () => {
      let lotteryId = await lotteryContract.lotteryId();
      expect(lotteryId).to.equal(0);

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      lotteryId = await lotteryContract.lotteryId();
      expect(lotteryId).to.equal(1);
    });

    it('should set the current id correctly', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      const lottery = await lotteryContract.getLottery(1);

      expect(lottery.id).to.equal("1");
    });

    it('should have the correct required ticket price', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      const lottery = await lotteryContract.getLottery(1);

      expect(lottery.ticket).to.equal(TICKET_PRICE);
    });

    it('should have the correct required duration', async () => {
      const transaction = await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      const transactionReceipt = await transaction.wait();
      const blockNumber = transactionReceipt.blockNumber;

      const lottery = await lotteryContract.getLottery(1);

      const timestamp = (await ethers.provider.getBlock(blockNumber)).timestamp;

      expect(lottery.endTime).to.equal(timestamp + DURATION);
    });

    it("should not have any participants at first", async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.participants).to.be.an("array");
      expect(lottery.participants).to.have.lengthOf(0);
    });

    it('should have open state', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(0);
    });
  })

  it('should return the correct open lotteries ids', async () => {
    let openLotteriesIds = await lotteryContract.getOpenLotteriesIds();

    expect(openLotteriesIds).to.be.an("array");
    expect(openLotteriesIds).to.have.lengthOf(0);

    await lotteryContract.createLottery(TICKET_PRICE, DURATION);
    openLotteriesIds = await lotteryContract.getOpenLotteriesIds()

    expect(openLotteriesIds).to.be.an("array");
    expect(openLotteriesIds).to.have.lengthOf(1);
    expect(openLotteriesIds[0]).to.equal(1);
  });

  describe('participation', () => {
    it('should be reverted when admin tries to participate in a lottery', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await expect(
        lotteryContract.participate(1, OPTIONS)
      ).to.be.revertedWith("OwnerCannotParticipateInLotteries()")
    });

    it('should be reverted when trying to participate without exact payment', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await expect(lotteryContract.connect(user1).participate(1))
        .to.be.revertedWith("TicketPaymentIsNotExact()");
      await expect(
        lotteryContract.connect(user1).participate(1, {
          value: ethers.utils.parseEther("1.1"),
        })
      ).to.be.revertedWith("TicketPaymentIsNotExact()");
      await expect(
        lotteryContract.connect(user1).participate(1, {
          value: ethers.utils.parseEther("0.9"),
        })
      ).to.be.revertedWith("TicketPaymentIsNotExact()");
    });

    it('should be reverted when trying to participate in an nonexistent lottery', async () => {
      await expect(lotteryContract.connect(user1).participate(1))
        .to.be.revertedWith("LotteryDoesNotExist()");
    });

    it('should be reverted when users try to participate twice', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await expect(lotteryContract.connect(user1).participate(1, OPTIONS)).to.be.revertedWith("UserHasAlreadyParticipated()")
    });

    it('should be reverted when users try to participate if lottery is not open anymore', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      await lotteryContract.declareWinner(1)

      await expect(
        lotteryContract.connect(user2).participate(1, OPTIONS)
      ).to.be.revertedWith("LotteryClosedToNewParticipants()");
    });

    it("should add a new user to the lottery correctly", async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      await lotteryContract.connect(user1).participate(1, OPTIONS);
      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.participants[0]).to.equal(user1.address);
    });

    it("should add the lottery id to the user's participations list", async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user1).participate(2, OPTIONS);

      const participations = await lotteryContract.getParticipationsByUser(user1.address);
      expect(
        participations.map(val => val.toNumber())
      ).deep.to.equal([1, 2])
    });

    it("should increment the jackpot correctly", async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      let lottery = await lotteryContract.getLottery(1);
      expect(lottery.jackpot).to.equal(0);

      await lotteryContract.connect(user1).participate(1, OPTIONS);
      lottery = await lotteryContract.getLottery(1);
      expect(lottery.jackpot).to.equal(TICKET_PRICE);
    });
  })

  describe("declaring winner", async () => {
    it("should be reverted if the finalization time has not come yet", async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWith("LotteryHasNotFinishedYet()")
    });

    it("should be reverted if game that does not exist", async () => {
      await fundWithLink();

      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWith("LotteryDoesNotExist()");
    });

    it('should be reverted if contract does not have enough LINK', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWith("NotEnoughLINK()")
    });

    it('requests a random number to the VRF coordinator', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      await expect(lotteryContract.declareWinner(1))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('changes lottery state to closed', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      await lotteryContract.declareWinner(1);

      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(1)
    });

    it('selects a winner', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER_EXAMPLE,
        lotteryContract.address
      )).to.emit(
        lotteryContract,
        "WinnerDeclared"
      ).withArgs(1, user2.address);

      const lottery = await lotteryContract.getLottery(1)
      expect(lottery.winner).to.equal(user2.address)
    });

    it('removes lotteries from the collection of open lotteries', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.createLottery(TICKET_PRICE, DURATION * 2)
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      let openLotteriesIds = await lotteryContract.getOpenLotteriesIds()
      expect(openLotteriesIds).to.have.lengthOf(2);
      expect(openLotteriesIds.map(val => val.toNumber())).deep.to.equal([1, 2])

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER_EXAMPLE,
        lotteryContract.address
      ))

      openLotteriesIds = await lotteryContract.getOpenLotteriesIds()
      expect(openLotteriesIds).to.have.lengthOf(1);
      expect(openLotteriesIds.map(val => val.toNumber())).deep.to.equal([2])
    });

    it('transfer the jackpot to the winner', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(await vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER_EXAMPLE,
        lotteryContract.address
      )).to.changeEtherBalance(
        user2,
        TICKET_PRICE.mul(2)
      );
    });

    it('changes lottery state to WINNER_DECLARED when there is a winner', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt.events.find(e => e.event === "WinnerRequested")
      const requestId = event.args.requestId

      await expect(await vrfCoordinatorContract.callBackWithRandomness(
        requestId,
        RANDOM_NUMBER_EXAMPLE,
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
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.false
      expect(upkeepNeeded[1]).to.equal("0x");
    });

    it('checkUpkeep should return false if there are not at least two participants in the lottery', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);

      await helpers.time.increase(DURATION);

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.false
      expect(upkeepNeeded[1]).to.equal("0x");
    });

    it('checkUpkeep should return true and lottery id when there is an open lottery and the end time has come', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.true
      expect(BigNumber.from(upkeepNeeded[1])).to.equal("1");
    });

    it('performUpkeep should call declare winner if conditions are met', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(lotteryContract.performUpkeep(upkeepNeeded[1]))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('checkUpkeep should return false for a lottery if its end time has come but its state is closed', async () => {
      await fundWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await helpers.time.increase(DURATION)

      let upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(upkeepNeeded[0]).to.be.true

      await expect(lotteryContract.performUpkeep(upkeepNeeded[1]))

      upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(upkeepNeeded[0]).to.be.false
    });
  })

  it('returns the balance of LINK tokens in the contract', async () => {
    await lotteryContract.createLottery(TICKET_PRICE, DURATION);
    await lotteryContract.connect(user1).participate(1, OPTIONS);
    await lotteryContract.connect(user2).participate(1, OPTIONS);

    expect(await lotteryContract.getLinkBalance()).to.equal(0)

    await fundWithLink();

    expect(await lotteryContract.getLinkBalance()).to.equal(ethers.utils.parseEther("1"))
  });

  it('withdrawing works correctly', async () => {
    const initialUserBalance = await linkTokenContract.balanceOf(deployer.address)

    await fundWithLink();

    let newUserBalance = await linkTokenContract.balanceOf(deployer.address)

    expect(initialUserBalance).not.to.be.equal(newUserBalance)

    await lotteryContract.withdrawLink();

    newUserBalance = await linkTokenContract.balanceOf(deployer.address)

    expect(initialUserBalance).to.be.equal(newUserBalance)
  });
})
