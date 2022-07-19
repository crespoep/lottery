const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe('Lottery', () => {
  it('is deployed successfully', async () => {
    await deployments.fixture(["test"]);
    let Lottery = await deployments.get("Lottery");
    let lottery = await ethers.getContractAt("Lottery", Lottery.address);

    const address = await lottery.address;
    expect(address).not.to.equal(null);
    expect(address).not.to.equal(0x0);
    expect(address).not.to.equal("");
    expect(address).not.to.equal(undefined);
  });

  it('game creation increments the number of games', async () => {
    await deployments.fixture(["test"]);
    let Lottery = await deployments.get("Lottery");
    let lottery = await ethers.getContractAt("Lottery", Lottery.address);

    let num = await lottery.lotteryId();
    expect(num).to.equal(0);

    await lottery.createLottery();

    num = await lottery.lotteryId();
    expect(num).to.equal(1);
  });
})
