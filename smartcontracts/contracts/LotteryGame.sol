// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

error TicketPriceNotGreaterThanZero();
error LotteryDurationNotEnough();
error LotteryClosedToNewParticipants();
error TicketPaymentIsNotExact();
error LotteryHasNotFinishedYet();
error LotteryDoesNotExist();
error CallerIsNotTheOwner();
error OwnerCannotParticipateInLotteries();
error UserHasAlreadyParticipated();
error NotEnoughLINK();
error TransferToWinnerFailed();

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

  modifier onlyOwner() {
    if (msg.sender != owner) {
      revert CallerIsNotTheOwner();
    }
    _;
  }

  modifier notOwner() {
    if (msg.sender == owner) {
      revert OwnerCannotParticipateInLotteries();
    }
    _;
  }

  modifier lotteryExist(uint256 _lotteryId) {
    Lottery memory _lottery = lotteryById[_lotteryId];
    if (_lottery.id == 0) {
      revert LotteryDoesNotExist();
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

  function createLottery(uint256 _ticket, uint256 _duration) public onlyOwner {
    _checkTicketPrice(_ticket);
    _checkDuration(_duration);

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
    notOwner
    lotteryExist(_lotteryId)
  {
    Lottery storage _lottery = lotteryById[_lotteryId];

    _checkUserHasNotAlreadyParticipated(_lotteryId);
    _checkIfLotteryIsClosed(_lottery.state);
    _checkIfTicketPaymentIsExact(_lottery.ticket);

    _lottery.participants.push(msg.sender);
    _lottery.jackpot += msg.value;

    participationsByUser[msg.sender].push(_lotteryId);
  }

  function declareWinner(uint256 _lotteryId) public lotteryExist(_lotteryId) {
    if (LINK.balanceOf(address(this)) < fee) {
      revert NotEnoughLINK();
    }

    Lottery storage _lottery = lotteryById[_lotteryId];
    _checkIfLotteryHasFinished(_lottery.endTime);

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

    if (!success) {
      revert TransferToWinnerFailed();
    }

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

      if (_keeperConditionsPassed(_lottery)) {
        upkeepNeeded = true;
        data = abi.encode(_lotteryId);
      }
    }

    return (upkeepNeeded, data);
  }

  function performUpkeep(bytes calldata performData) external override {
    uint256 _lotteryId = abi.decode(performData, (uint256));
    Lottery memory _lottery = lotteryById[_lotteryId];
    if (_keeperConditionsPassed(_lottery)) {
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

  function _checkTicketPrice(uint256 _ticketPrice) private pure {
    if (_ticketPrice <= 0) {
      revert TicketPriceNotGreaterThanZero();
    }
  }

  function _checkDuration(uint256 _duration) private pure {
    if (_duration < 60) {
      revert LotteryDurationNotEnough();
    }
  }

  function _checkIfLotteryIsClosed(State _state) private pure {
    if (_state != State.OPEN) {
      revert LotteryClosedToNewParticipants();
    }
  }

  function _checkIfTicketPaymentIsExact(uint256 _ticket) private view {
    if (msg.value != _ticket) {
      revert TicketPaymentIsNotExact();
    }
  }

  function _checkIfLotteryHasFinished(uint256 _endTime) private view {
    if (_endTime > block.timestamp) {
      revert LotteryHasNotFinishedYet();
    }
  }

  function _checkUserHasNotAlreadyParticipated(uint256 _lotteryId) private view {
    Lottery memory _lottery = lotteryById[_lotteryId];
    address[] memory participants = _lottery.participants;
    address user = msg.sender;
    for (uint256 i = 0; i < participants.length; i++) {
      if (user == participants[i]) {
        revert UserHasAlreadyParticipated();
      }
    }
  }

  function _keeperConditionsPassed(Lottery memory _lottery) private view returns (bool) {
    return (
      _lottery.endTime < block.timestamp &&
      _lottery.state == State.OPEN &&
      _lottery.participants.length > 1
    );
  }
}
