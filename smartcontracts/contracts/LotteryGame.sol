// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract LotteryGame {
  using Counters for Counters.Counter;

  Counters.Counter public lotteryId;

  uint256[] public openLotteries;

  struct Lottery {
    uint256 id;
    uint256 ticket;
    uint256 endTime;
    uint256 jackpot;
    address[] participants;
  }

  mapping(uint256 => Lottery) private lotteryById;

  modifier lotteryExist(uint256 _lotteryId) {
    Lottery memory _lottery = lotteryById[_lotteryId];
    require(_lottery.id > 0, "The lottery does not exist");
    _;
  }

  function createLottery(uint256 _ticket, uint256 _duration) public {
    uint256 _endTime = block.timestamp + _duration;
    lotteryId.increment();
    uint256 _currentId = lotteryId.current();
    address[] memory _participants = new address[](0);
    lotteryById[_currentId] = Lottery(_currentId, _ticket, _endTime, 0, _participants);
    openLotteries.push(_currentId);
  }

  function participate(uint256 _lotteryId) external lotteryExist(_lotteryId) payable {
    Lottery storage _lottery = lotteryById[_lotteryId];

    require(msg.value == _lottery.ticket, "The ticket payment should be exact");
    _lottery.participants.push(msg.sender);
    _lottery.jackpot += msg.value;
  }

  function declareWinner(uint256 _lotteryId) external lotteryExist(_lotteryId) view {
    Lottery memory _lottery = lotteryById[_lotteryId];
    require(_lottery.endTime < block.timestamp, "The lottery has not finished yet");
  }

  function getOpenLotteriesIds() public view returns(uint256[] memory) {
    return openLotteries;
  }

  function getLottery(uint256 _lotteryId) external view returns(Lottery memory){
    return lotteryById[_lotteryId];
  }
}
