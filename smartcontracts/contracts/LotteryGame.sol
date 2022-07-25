// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract LotteryGame is VRFConsumerBase {
  using Counters for Counters.Counter;

  Counters.Counter public lotteryId;

  uint256 internal fee;

  bytes32 internal keyHash;

  uint256[] public openLotteries;

  struct Lottery {
    uint256 id;
    uint256 ticket;
    uint256 endTime;
    uint256 jackpot;
    address winner;
    address[] participants;
  }

  mapping(uint256 => Lottery) private lotteryById;

  mapping(bytes32 => uint256) private lotteryIdByRequestId;

  event WinnerRequested(bytes32 indexed requestId);

  event WinnerDeclared(
    uint256 indexed lotteryId,
    address indexed winner
  );

  modifier lotteryExist(uint256 _lotteryId) {
    Lottery memory _lottery = lotteryById[_lotteryId];
    require(_lottery.id > 0, "The lottery does not exist");
    _;
  }

  constructor(
    address _vrfCoordinatorAddress,
    address _linkAddress,
    bytes32 _keyHash,
    uint256 _fee
  ) VRFConsumerBase (_vrfCoordinatorAddress, _linkAddress) {
    keyHash = _keyHash;
    fee = _fee;
  }

  function createLottery(uint256 _ticket, uint256 _duration) public {
    uint256 _endTime = block.timestamp + _duration;
    lotteryId.increment();
    uint256 _currentId = lotteryId.current();
    address[] memory _participants = new address[](0);
    lotteryById[_currentId] = Lottery(_currentId, _ticket, _endTime, 0, address(0), _participants);
    openLotteries.push(_currentId);
  }

  function participate(uint256 _lotteryId) external lotteryExist(_lotteryId) payable {
    Lottery storage _lottery = lotteryById[_lotteryId];

    require(msg.value == _lottery.ticket, "The ticket payment should be exact");
    _lottery.participants.push(msg.sender);
    _lottery.jackpot += msg.value;
  }

  function declareWinner(uint256 _lotteryId) external lotteryExist(_lotteryId) {
    Lottery memory _lottery = lotteryById[_lotteryId];
    require(_lottery.endTime < block.timestamp, "The lottery has not finished yet");

    bytes32 requestId = requestRandomness(keyHash, fee);
    lotteryIdByRequestId[requestId] = _lotteryId;
    emit WinnerRequested(requestId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 _lotteryId = lotteryIdByRequestId[requestId];
    Lottery storage _lottery = lotteryById[_lotteryId];
    address[] memory _participants = _lottery.participants;
    address _winner = _participants[randomness % _participants.length];
    _lottery.winner = _winner;

    emit WinnerDeclared(_lotteryId, _winner);
  }

  function getOpenLotteriesIds() public view returns(uint256[] memory) {
    return openLotteries;
  }

  function getLottery(uint256 _lotteryId) external view returns(Lottery memory){
    return lotteryById[_lotteryId];
  }
}
