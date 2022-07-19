pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Lottery {
  using Counters for Counters.Counter;

  Counters.Counter public lotteryId;

  function createLottery() public {
    lotteryId.increment();
  }
}
