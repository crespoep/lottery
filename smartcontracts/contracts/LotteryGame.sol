// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

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
error NotEnoughParticipants();
error LotteryAlreadyClosed();

/** @author Pedro Crespo
 *  @title Crypto lottery game
 */
contract LotteryGame is VRFConsumerBaseV2, KeeperCompatibleInterface {
    using Counters for Counters.Counter;

    struct Lottery {
        uint256 id;
        uint256 ticket;
        uint256 endTime;
        uint256 jackpot;
        address winner;
        address[] participants;
        State state;
    }

    enum State {
        OPEN,
        CLOSED,
        WINNER_DECLARED
    }

    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    uint32 private constant CALLBACK_GAS_LIMIT = 100000;
    uint32 private constant NUM_WORDS = 1;

    uint64 public subscriptionId;

    bytes32 internal keyHash;

    Counters.Counter public lotteryId;

    VRFCoordinatorV2Interface private coordinator;

    address public owner;

    mapping(uint256 => Lottery) private lotteryById;
    mapping(uint256 => uint256) private lotteryIdByRequestId;
    mapping(address => uint256[]) private participationsByUser;
    mapping(address => uint256) public balances;

    uint256[] public openLotteries;
    uint256[] public randomWords;

    event LotteryCreated(
        uint256 indexed id,
        uint256 indexed ticketPrice,
        uint256 endDate
    );
    event ParticipationRegistered(
        uint256 indexed lotteryId,
        address indexed user
    );
    event WinnerRequested(uint256 indexed lotteryId, uint256 indexed requestId);
    event WinnerDeclared(uint256 indexed lotteryId, address indexed winner);

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
        bytes32 _keyHash,
        uint64 _subscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinatorAddress) {
        coordinator = VRFCoordinatorV2Interface(_vrfCoordinatorAddress);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        owner = msg.sender;
    }

    /**
     *  @dev creates a new lottery
     *  @param _ticket amount of money needed to participate in the lottery
     *  @param _duration how much time the lottery will last in seconds
     */
    function createLottery(uint256 _ticket, uint256 _duration)
        external
        onlyOwner
    {
        _checkIfTicketPriceIsValid(_ticket);
        _checkIfDurationIsValid(_duration);

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

        emit LotteryCreated(_currentId, _ticket, _endTime);
    }

    /**
     *  @dev adds the caller as a new participant to correspondent lottery
     *  @param _lotteryId lottery id
     */
    function participate(uint256 _lotteryId)
        external
        payable
        notOwner
        lotteryExist(_lotteryId)
    {
        Lottery storage _lottery = lotteryById[_lotteryId];

        _checkUserHasNotAlreadyParticipated(_lotteryId);
        _checkIfLotteryIsOpen(_lottery.state);
        _checkIfTicketPaymentIsExact(_lottery.ticket);

        _lottery.participants.push(msg.sender);
        _lottery.jackpot += msg.value;

        participationsByUser[msg.sender].push(_lotteryId);

        emit ParticipationRegistered(_lotteryId, msg.sender);
    }

    /**
     *  @dev called by keepers to check if at least one lottery is ready to be closed
     *       It returns the first one ready to be closed that it finds.
     *  @return a tuple with boolean and the encoded lottery id to be closed if exists
     */
    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool, bytes memory)
    {
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

    /**
     *  @dev called by keeper to initiate the process of requesting a random number
     *       and establish a winner for a specific lottery, after checking again if
     *       conditions are meet for security reasons
     *  @param performData encoded id for the lottery sent by checkUpkeep
     */
    function performUpkeep(bytes calldata performData) external override {
        uint256 _lotteryId = abi.decode(performData, (uint256));
        Lottery memory _lottery = lotteryById[_lotteryId];
        if (_keeperConditionsPassed(_lottery)) {
            declareWinner(_lotteryId);
        }
    }

    /**
     *  @dev returns a list of lotteries ids which user has participated in
     *  @param _user the user address
     *  @return the list of the participations
     */
    function getParticipationsByUser(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return participationsByUser[_user];
    }

    /**
     *  @dev returns a lottery by id
     *  @param _lotteryId the lottery id
     *  @return the lottery
     */
    function getLottery(uint256 _lotteryId)
        external
        view
        returns (Lottery memory)
    {
        return lotteryById[_lotteryId];
    }

    /** @dev Requests a random number to oracles and closes the correspondent lottery.
     *       Reverts if the end time has not come yet, if there are not at least two participants or if
     *       this method is called again after randomness is requested but not done.
     *  @param _lotteryId lottery id
     */
    function declareWinner(uint256 _lotteryId) public lotteryExist(_lotteryId) {
        Lottery storage _lottery = lotteryById[_lotteryId];

        _checkIfLotteryIsOpen(_lottery.state);
        _checkIfLotteryHasFinished(_lottery.endTime);
        _checkIfThereAreEnoughParticipants(_lottery.participants.length);

        uint256 requestId = coordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );

        lotteryIdByRequestId[requestId] = _lotteryId;

        _lottery.state = State.CLOSED;

        emit WinnerRequested(_lotteryId, requestId);
    }

    /**
     *  @dev returns the ids of the lotteries where winner has not been established yet.
     *       The lotteries may be already closed and randomness requested but not received.
     *  @return the list of lotteries ids
     */
    function getOpenLotteriesIds() public view returns (uint256[] memory) {
        return openLotteries;
    }

    function withdraw() external {
        uint256 _balance = balances[msg.sender];
        require(_balance > 0);
        balances[msg.sender] = 0;
        msg.sender.call{value: _balance}("");
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomness)
        internal
        override
    {
        uint256 _lotteryId = lotteryIdByRequestId[requestId];
        Lottery storage _lottery = lotteryById[_lotteryId];
        address[] memory _participants = _lottery.participants;
        address _winner = _participants[randomness[0] % _participants.length];
        _lottery.winner = _winner;

        balances[_winner] += _lottery.jackpot;

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

    function _checkIfTicketPriceIsValid(uint256 _ticketPrice) private pure {
        if (_ticketPrice <= 0) {
            revert TicketPriceNotGreaterThanZero();
        }
    }

    function _checkIfDurationIsValid(uint256 _duration) private pure {
        if (_duration < 60) {
            revert LotteryDurationNotEnough();
        }
    }

    function _checkIfLotteryIsOpen(State _state) private pure {
        if (_state != State.OPEN) {
            revert LotteryAlreadyClosed();
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

    function _checkIfThereAreEnoughParticipants(uint256 _numberOfParticipants)
        private
        pure
    {
        if (_numberOfParticipants < 2) {
            revert NotEnoughParticipants();
        }
    }

    function _checkUserHasNotAlreadyParticipated(uint256 _lotteryId)
        private
        view
    {
        Lottery memory _lottery = lotteryById[_lotteryId];
        address[] memory participants = _lottery.participants;
        address user = msg.sender;
        for (uint256 i = 0; i < participants.length; i++) {
            if (user == participants[i]) {
                revert UserHasAlreadyParticipated();
            }
        }
    }

    function _keeperConditionsPassed(Lottery memory _lottery)
        private
        view
        returns (bool)
    {
        return (_lottery.endTime < block.timestamp &&
            _lottery.state == State.OPEN &&
            _lottery.participants.length > 1);
    }
}
