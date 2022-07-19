const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe('Lottery', () => {
  let
    Lottery,
    lottery
  ;

  beforeEach(async () => {
    await deployments.fixture(["test"]);
    Lottery = await deployments.get("Lottery");
    lottery = await ethers.getContractAt("Lottery", Lottery.address);
  })

  it('is deployed successfully', async () => {
    const address = await lottery.address;

    expect(address).not.to.equal(null);
    expect(address).not.to.equal(0x0);
    expect(address).not.to.equal("");
    expect(address).not.to.equal(undefined);
  });

  it('game creation increments the number of games', async () => {
    let num = await lottery.lotteryId();
    expect(num).to.equal(0);

    await lottery.createLottery();

    num = await lottery.lotteryId();
    expect(num).to.equal(1);
  });
})
