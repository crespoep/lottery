// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract LotteryGame is VRFConsumerBase, KeeperCompatibleInterface {
  using Counters for Counters.Counter;

  Counters.Counter public lotteryId;

  address public owner;

  uint256 internal fee;

  bytes32 internal keyHash;

  uint256[] public openLotteries;

  enum State { OPEN, CLOSED, WINNER_DECLARED }

  struct Lottery {
    uint256 id;
    uint256 ticket;
    uint256 endTime;
    uint256 jackpot;
    address winner;
    address[] participants;
    State state;
  }

  mapping(uint256 => Lottery) private lotteryById;

  mapping(bytes32 => uint256) private lotteryIdByRequestId;

  mapping(address => uint256[]) private participationsByUser;

  event WinnerRequested(
    uint256 indexed lotteryId,
    bytes32 indexed requestId
  );

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
    owner = msg.sender;
  }

  function createLottery(uint256 _ticket, uint256 _duration) public {
    require(msg.sender == owner, "Ownable: caller is not the owner");
    require(_ticket > 0, "Ticket price must be greater than zero");
    require(_duration >= 60, "Lottery duration cannot be less than a minute");

    uint256 _endTime = block.timestamp + _duration;
    lotteryId.increment();
    uint256 _currentId = lotteryId.current();
    address[] memory _participants = new address[](0);

    lotteryById[_currentId] = Lottery({
      id: _currentId,
      ticket: _ticket,
      endTime: _endTime,
      jackpot: 0,
      winner: address(0),
      participants: _participants,
      state: State.OPEN
    });

    openLotteries.push(_currentId);
  }

  function participate(uint256 _lotteryId)
    external payable
    lotteryExist(_lotteryId)
    notParticipated(_lotteryId)
  {
    Lottery storage _lottery = lotteryById[_lotteryId];

    require(msg.sender != owner, "Owner cannot participate in a lottery");
    require(_lottery.state == State.OPEN, "Lottery is closed to new participants");
    require(msg.value == _lottery.ticket, "The ticket payment should be exact");

    _lottery.participants.push(msg.sender);
    _lottery.jackpot += msg.value;

    participationsByUser[msg.sender].push(_lotteryId);
  }

  function declareWinner(uint256 _lotteryId) public lotteryExist(_lotteryId) {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");

    Lottery storage _lottery = lotteryById[_lotteryId];
    require(_lottery.endTime < block.timestamp, "The lottery has not finished yet");

    bytes32 requestId = requestRandomness(keyHash, fee);
    lotteryIdByRequestId[requestId] = _lotteryId;

    _lottery.state = State.CLOSED;

    emit WinnerRequested(_lotteryId, requestId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 _lotteryId = lotteryIdByRequestId[requestId];
    Lottery storage _lottery = lotteryById[_lotteryId];
    address[] memory _participants = _lottery.participants;
    address _winner = _participants[randomness % _participants.length];
    _lottery.winner = _winner;

    (bool success, ) = _winner.call{ value: _lottery.jackpot }("");
    require(success, "Transfer to winner failed");

    _lottery.state = State.WINNER_DECLARED;

    for (uint256 i = 0; i < openLotteries.length; i++) {
      uint256 _openLotteryId = openLotteries[i];
      Lottery memory _openLottery = lotteryById[_openLotteryId];
      if (_lotteryId == _openLottery.id) {
        openLotteries[i] = openLotteries[openLotteries.length - 1];
        openLotteries.pop();
      }
    }

    emit WinnerDeclared(_lotteryId, _winner);

    delete lotteryIdByRequestId[requestId];
  }

  function checkUpkeep(bytes calldata) external view override returns (bool, bytes memory) {
    bool upkeepNeeded = false;
    bytes memory data = bytes("");

    for (uint256 i = 0; i < openLotteries.length; i++) {
      uint256 _lotteryId = openLotteries[i];
      Lottery memory _lottery = lotteryById[_lotteryId];

      if (_lottery.endTime < block.timestamp && _lottery.state == State.OPEN) {
        upkeepNeeded = true;
        data = abi.encode(_lotteryId);
      }
    }

    return (upkeepNeeded, data);
  }

  function performUpkeep(bytes calldata performData) external override {
    uint256 _lotteryId = abi.decode(performData, (uint256));
    Lottery memory _lottery = lotteryById[_lotteryId];
    if (_lottery.endTime < block.timestamp) {
      declareWinner(_lotteryId);
    }
  }

  function getOpenLotteriesIds() public view returns(uint256[] memory) {
    return openLotteries;
  }

  function getParticipationsByUser(address _user) external view returns(uint256[] memory) {
    return participationsByUser[_user];
  }

  function getLottery(uint256 _lotteryId) external view returns(Lottery memory){
    return lotteryById[_lotteryId];
  }

  function getLinkBalance() public view returns(uint256) {
    return LINK.balanceOf(address(this));
  }

  function withdrawLink() external {
    LINK.transfer(owner, getLinkBalance());
  }
}
