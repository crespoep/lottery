// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract LotteryGame {
  using Counters for Counters.Counter;

  Counters.Counter public lotteryId;

  struct Lottery {
    uint256 id;
    uint256 ticket;
    uint256 endTime;
    address[] participants;
  }

  mapping(uint256 => Lottery) private lotteryById;

  function createLottery(uint256 _ticket, uint256 _duration) public {
    uint256 _endTime = block.timestamp + _duration;
    lotteryId.increment();
    uint256 _currentId = lotteryId.current();
    address[] memory _participants = new address[](0);
    lotteryById[_currentId] = Lottery(_currentId, _ticket, _endTime, _participants);
  }

  function getLottery(uint256 _lotteryId) external view returns(Lottery memory){
    return lotteryById[_lotteryId];
  }
}
