// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract LotteryGame is VRFConsumerBase, KeeperCompatibleInterface, Ownable {
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

  modifier notParticipated(uint256 _lotteryId) {
    Lottery memory _lottery = lotteryById[_lotteryId];
    address[] memory participants = _lottery.participants;
    address user = msg.sender;
    for (uint256 i = 0; i < participants.length; i++) {
      if (user == participants[i]) {
        revert("User already participated");
      }
    }
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

  function createLottery(uint256 _ticket, uint256 _duration) public onlyOwner {
    require(_ticket > 0, "Ticket price must be greater than zero");
    require(_duration >= 60, "Lottery duration cannot be less than a minute");

    uint256 _endTime = block.timestamp + _duration;
    lotteryId.increment();
    uint256 _currentId = lotteryId.current();
    address[] memory _participants = new address[](0);
    lotteryById[_currentId] = Lottery(_currentId, _ticket, _endTime, 0, address(0), _participants);
    openLotteries.push(_currentId);
  }

  function participate(uint256 _lotteryId)
    external payable
    lotteryExist(_lotteryId)
    notParticipated(_lotteryId)
  {
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

    (bool success, ) = _winner.call{ value: _lottery.jackpot }("");
    require(success, "Transfer to winner failed");

    emit WinnerDeclared(_lotteryId, _winner);

    delete lotteryIdByRequestId[requestId];
  }

  function checkUpkeep(bytes calldata) external view override returns (bool, bytes memory) {
    bool upkeepNeeded = false;
    bytes memory data = bytes("");

    for (uint256 i = 0; i < openLotteries.length; i++) {
      uint256 _lotteryId = openLotteries[i];
      Lottery memory _lottery = lotteryById[_lotteryId];

      if (_lottery.endTime < block.timestamp) {
        upkeepNeeded = true;
      }
    }

    return (upkeepNeeded, data);
  }

  function performUpkeep(bytes calldata performData) external override {}

  function getOpenLotteriesIds() public view returns(uint256[] memory) {
    return openLotteries;
  }

  function getLottery(uint256 _lotteryId) external view returns(Lottery memory){
    return lotteryById[_lotteryId];
  }
}
