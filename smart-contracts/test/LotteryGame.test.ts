import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { Contract } from "ethers";
// @ts-ignore
import { LotteryGame } from "../typechain-types";

const { ethers, deployments } = require("hardhat");

describe('LotteryGame', () => {
  const TICKET_PRICE = ethers.constants.WeiPerEther;
  const DURATION = 60;
  const OPTIONS = { value: TICKET_PRICE };

  let
    deployer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    user3: SignerWithAddress,
    LotteryGame,
    lotteryContract: LotteryGame,
    VRFCoordinator,
    vrfCoordinatorContract: Contract,
    fundSubscriptionWithLink: Function
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);

    [deployer, user1, user2, user3] = await ethers.getSigners();

    LotteryGame = await deployments.get("LotteryGame");
    VRFCoordinator = await deployments.get("VRFCoordinatorV2Mock");

    lotteryContract = await ethers.getContractAt("LotteryGame", LotteryGame.address);
    vrfCoordinatorContract = await ethers.getContractAt("VRFCoordinatorV2Mock", VRFCoordinator.address);

    fundSubscriptionWithLink = async () => {
      await vrfCoordinatorContract.createSubscription()
      await vrfCoordinatorContract.fundSubscription(1, ethers.utils.parseEther("1"))
    }
  })

  it('is deployed successfully', async () => {
    const address = lotteryContract.address;

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
      ).to.be.revertedWithCustomError(lotteryContract, "TicketPriceNotGreaterThanZero");
    });

    it('should be reverted if duration is less than 60 seconds', async () => {
      const invalidDuration = 50;
      await expect(
        lotteryContract.createLottery(TICKET_PRICE, invalidDuration)
      ).to.be.revertedWithCustomError(lotteryContract, "LotteryDurationNotEnough");
    });

    it('should be reverted if anyone other than the admin tries to create a lottery', async () => {
      await expect(
        lotteryContract.connect(user1).createLottery(TICKET_PRICE, DURATION)
      ).to.be.revertedWithCustomError(lotteryContract, "CallerIsNotTheOwner");
    });

    it('should emit LotteryCreated event', async () => {
      const tx = await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      const receipt = await tx.wait();
      const blockNumber = receipt.blockNumber;
      const timestamp = (await ethers.provider.getBlock(blockNumber)).timestamp;
      const event = receipt?.events?.find((e: any) => e.event === "LotteryCreated")
      const args = event?.args
      expect(event?.event).to.equal("LotteryCreated")
      expect(args?.id).to.equal(1)
      expect(args?.ticketPrice).to.equal(TICKET_PRICE)
      expect(args?.endDate).to.equal(timestamp + DURATION)
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
      const participants = await lotteryContract.getParticipantsByLotteryId(1);
      expect(participants).to.deep.equal([])
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
      ).to.be.revertedWithCustomError(lotteryContract, "OwnerCannotParticipateInLotteries")
    });

    it('should be reverted when trying to participate without exact payment', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await expect(lotteryContract.connect(user1).participate(1))
        .to.be.revertedWithCustomError(lotteryContract, "TicketPaymentIsNotExact");
      await expect(
        lotteryContract.connect(user1).participate(1, {
          value: ethers.utils.parseEther("1.1"),
        })
      ).to.be.revertedWithCustomError(lotteryContract, "TicketPaymentIsNotExact");
      await expect(
        lotteryContract.connect(user1).participate(1, {
          value: ethers.utils.parseEther("0.9"),
        })
      ).to.be.revertedWithCustomError(lotteryContract, "TicketPaymentIsNotExact");
    });

    it('should be reverted when trying to participate in an nonexistent lottery', async () => {
      await expect(lotteryContract.connect(user1).participate(1))
        .to.be.revertedWithCustomError(lotteryContract, "LotteryDoesNotExist");
    });

    it('should be reverted when users try to participate twice', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await expect(lotteryContract.connect(user1).participate(1, OPTIONS)).to.be.revertedWithCustomError(lotteryContract, "UserHasAlreadyParticipated")
    });

    it('should be reverted when users try to participate if lottery is not open anymore', async () => {
      await vrfCoordinatorContract.createSubscription();
      await vrfCoordinatorContract.fundSubscription(1, ethers.utils.parseEther("1"));

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      await lotteryContract.declareWinner(1)

      await expect(
        lotteryContract.connect(user3).participate(1, OPTIONS)
      ).to.be.revertedWithCustomError(lotteryContract, "LotteryAlreadyClosed");
    });

    it("should add a new user to the lottery correctly", async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      await lotteryContract.connect(user1).participate(1, OPTIONS);
      expect(await lotteryContract.getParticipantsByLotteryId(1)).to.deep.equal([user1.address])
    });

    it('should emit ParticipationRegistered event', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      const lotteryId = 1;
      await expect(lotteryContract.connect(user1).participate(lotteryId, OPTIONS))
        .to.emit(lotteryContract, "ParticipationRegistered")
        .withArgs(lotteryId, user1.address);

    });

    it("should add the lottery id to the user's participations list", async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);

      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user1).participate(2, OPTIONS);

      const participations = await lotteryContract.getParticipationsByUser(user1.address);
      expect(
        participations.map((val: any) => val.toNumber())
      ).deep.equal([1, 2])
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
    beforeEach(async() => {
      await vrfCoordinatorContract.createSubscription()
      await vrfCoordinatorContract.fundSubscription(1, ethers.utils.parseEther("1"))
    })

    it("should be reverted if the finalization time has not come yet", async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWithCustomError(lotteryContract, "LotteryHasNotFinishedYet")
    });

    it('should be reverted if there is less than two participants', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);

      await time.increase(DURATION)

      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWithCustomError(lotteryContract, "NotEnoughParticipants")
    });

    it('should be reverted if lottery is not open', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      await expect(lotteryContract.declareWinner(1))

      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWithCustomError(lotteryContract, "LotteryAlreadyClosed")
    });

    it("should be reverted if game that does not exist", async () => {
      await fundSubscriptionWithLink();

      await expect(lotteryContract.declareWinner(1))
        .to.be.revertedWithCustomError(lotteryContract, "LotteryDoesNotExist");
    });

    it('requests a random number to the VRF coordinator', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      await expect(lotteryContract.declareWinner(1))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('changes lottery state to closed', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      await lotteryContract.declareWinner(1);

      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(1)
    });

    it('selects a winner', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt?.events?.find((e: any) => e.event === "WinnerRequested")
      const requestId = event?.args?.requestId

      await expect(vrfCoordinatorContract.fulfillRandomWords(
        requestId,
        lotteryContract.address
      )).to.emit(
        lotteryContract,
        "WinnerDeclared"
      ).withArgs(1, user2.address);

      const lottery = await lotteryContract.getLottery(1)
      expect(lottery.winner).to.equal(user2.address)
    });

    it('removes lotteries from the collection of open lotteries', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.createLottery(TICKET_PRICE, DURATION * 2)
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      let openLotteriesIds = await lotteryContract.getOpenLotteriesIds()
      expect(openLotteriesIds).to.have.lengthOf(2);
      expect(openLotteriesIds.map((val: any) => val.toNumber())).deep.equal([1, 2])

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt?.events?.find((e: any) => e.event === "WinnerRequested")
      const requestId = event?.args?.requestId

      await expect(vrfCoordinatorContract.fulfillRandomWords(
        requestId,
        lotteryContract.address
      ))

      openLotteriesIds = await lotteryContract.getOpenLotteriesIds()
      expect(openLotteriesIds).to.have.lengthOf(1);
      expect(openLotteriesIds.map((val: any) => val.toNumber())).deep.equal([2])
    });

    it('increments the winner balance with the jackpot', async () => {
      await fundSubscriptionWithLink();
  
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);
  
      await time.increase(DURATION)
  
      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()
  
      const event = receipt?.events?.find((e: any) => e.event === "WinnerRequested")
      const requestId = event?.args?.requestId
  
      await vrfCoordinatorContract.fulfillRandomWords(
        requestId,
        lotteryContract.address
      );
  
      expect(await lotteryContract.balances(user2.address)).to.eq(ethers.utils.parseEther("2"))
    });

    it('changes lottery state to WINNER_DECLARED when there is a winner', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()

      const event = receipt?.events?.find((e: any) => e.event === "WinnerRequested")
      const requestId = event?.args?.requestId

      await expect(vrfCoordinatorContract.fulfillRandomWords(
        requestId,
        lotteryContract.address
      ))

      const lottery = await lotteryContract.getLottery(1);
      expect(lottery.state).to.equal(2)
    });
  })
  
  describe('withdraw', async () => {
    it('transfers the money to the caller successfully', async () => {
      await fundSubscriptionWithLink();
  
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);
  
      await time.increase(DURATION)
  
      let tx = await lotteryContract.declareWinner(1)
      let receipt = await tx.wait()
  
      const event = receipt?.events?.find((e: any) => e.event === "WinnerRequested")
      const requestId = event?.args?.requestId
  
      await vrfCoordinatorContract.fulfillRandomWords(
        requestId,
        lotteryContract.address
      );
      
      await expect(
        lotteryContract.connect(user2).withdraw())
          .to.changeEtherBalance(user2, ethers.utils.parseEther("2")
      );
    });
  
    it("should fail if user's balance is zero", async () => {
      await expect(
        lotteryContract.connect(user2).withdraw()
      ).to.be.reverted
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

      await time.increase(DURATION);

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.false
      expect(upkeepNeeded[1]).to.equal("0x");
    });

    it('checkUpkeep should return true and lottery id when there is an open lottery and the end time has come', async () => {
      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      expect(upkeepNeeded[0]).to.be.true
      expect(BigNumber.from(upkeepNeeded[1])).to.equal("1");
    });

    it('performUpkeep should call declare winner if conditions are met', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      const upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(lotteryContract.performUpkeep(upkeepNeeded[1]))
        .to.emit(lotteryContract, "WinnerRequested")
    });

    it('checkUpkeep should return false for a lottery if its end time has come but its state is closed', async () => {
      await fundSubscriptionWithLink();

      await lotteryContract.createLottery(TICKET_PRICE, DURATION);
      await lotteryContract.connect(user1).participate(1, OPTIONS);
      await lotteryContract.connect(user2).participate(1, OPTIONS);

      await time.increase(DURATION)

      let upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(upkeepNeeded[0]).to.be.true

      await expect(lotteryContract.performUpkeep(upkeepNeeded[1]))

      upkeepNeeded = (await lotteryContract.checkUpkeep("0x00"))

      await expect(upkeepNeeded[0]).to.be.false
    });
  })
})
