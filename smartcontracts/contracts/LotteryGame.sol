// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract LotteryGame {
  using Counters for Counters.Counter;

  Counters.Counter public lotteryId;

  struct Lottery {
    uint256 id;
  }

  mapping(uint256 => Lottery) private lotteryById;

  function createLottery() public {
    lotteryId.increment();
    uint256 currentId = lotteryId.current();
    lotteryById[currentId] = Lottery(currentId);
  }

  function getLottery(uint256 _lotteryId) external view returns(Lottery memory){
    return lotteryById[_lotteryId];
  }
}
