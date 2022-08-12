/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  LotteryGame,
  LotteryGameInterface,
} from "../../contracts/LotteryGame";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_vrfCoordinatorAddress",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_keyHash",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "_subscriptionId",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CallerIsNotTheOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "LotteryAlreadyClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "LotteryDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "LotteryDurationNotEnough",
    type: "error",
  },
  {
    inputs: [],
    name: "LotteryHasNotFinishedYet",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughParticipants",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "have",
        type: "address",
      },
      {
        internalType: "address",
        name: "want",
        type: "address",
      },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    inputs: [],
    name: "OwnerCannotParticipateInLotteries",
    type: "error",
  },
  {
    inputs: [],
    name: "TicketPaymentIsNotExact",
    type: "error",
  },
  {
    inputs: [],
    name: "TicketPriceNotGreaterThanZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferToWinnerFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "UserHasAlreadyParticipated",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "ticketPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
    ],
    name: "LotteryCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lotteryId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "ParticipationRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lotteryId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "WinnerDeclared",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lotteryId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "WinnerRequested",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ticket",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
    ],
    name: "createLottery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lotteryId",
        type: "uint256",
      },
    ],
    name: "declareWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lotteryId",
        type: "uint256",
      },
    ],
    name: "getLottery",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ticket",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "jackpot",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "participants",
            type: "address[]",
          },
          {
            internalType: "enum LotteryGame.State",
            name: "state",
            type: "uint8",
          },
        ],
        internalType: "struct LotteryGame.Lottery",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOpenLotteriesIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getParticipationsByUser",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lotteryId",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "openLotteries",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_lotteryId",
        type: "uint256",
      },
    ],
    name: "participate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "randomWords",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randomWords",
        type: "uint256[]",
      },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subscriptionId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162002c1738038062002c17833981810160405281019062000037919062000212565b828073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160088190555080600160146101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050506200026e565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200015a826200012d565b9050919050565b6200016c816200014d565b81146200017857600080fd5b50565b6000815190506200018c8162000161565b92915050565b6000819050919050565b620001a78162000192565b8114620001b357600080fd5b50565b600081519050620001c7816200019c565b92915050565b600067ffffffffffffffff82169050919050565b620001ec81620001cd565b8114620001f857600080fd5b50565b6000815190506200020c81620001e1565b92915050565b6000806000606084860312156200022e576200022d62000128565b5b60006200023e868287016200017b565b93505060206200025186828701620001b6565b92505060406200026486828701620001fb565b9150509250925092565b60805161298662000291600039600081816106e2015261073601526129866000f3fe6080604052600436106100dc5760003560e01c80638da5cb5b1161007f578063abdf979c11610059578063abdf979c146102b1578063beff730f146102ee578063e580f47b1461032b578063fe35804e14610356576100dc565b80638da5cb5b1461020c57806392e845f6146102375780639384c39d14610274576100dc565b80634585e33b116100bb5780634585e33b1461015e5780636e04ff0d1461018757806382d63ee6146101c5578063845c9306146101f0576100dc565b8062c2943c146100e157806309c1ba2e1461010a5780631fe543e314610135575b600080fd5b3480156100ed57600080fd5b5061010860048036038101906101039190611eaa565b61037f565b005b34801561011657600080fd5b5061011f6106c6565b60405161012c9190611efa565b60405180910390f35b34801561014157600080fd5b5061015c6004803603810190610157919061206e565b6106e0565b005b34801561016a57600080fd5b5061018560048036038101906101809190612125565b6107a0565b005b34801561019357600080fd5b506101ae60048036038101906101a99190612125565b61093a565b6040516101bc929190612215565b60405180910390f35b3480156101d157600080fd5b506101da610b49565b6040516101e79190612303565b60405180910390f35b61020a60048036038101906102059190611eaa565b610ba1565b005b34801561021857600080fd5b50610221610f49565b60405161022e9190612366565b60405180910390f35b34801561024357600080fd5b5061025e60048036038101906102599190611eaa565b610f6f565b60405161026b9190612552565b60405180910390f35b34801561028057600080fd5b5061029b600480360381019061029691906125a0565b6110e3565b6040516102a89190612303565b60405180910390f35b3480156102bd57600080fd5b506102d860048036038101906102d39190611eaa565b61117a565b6040516102e591906125dc565b60405180910390f35b3480156102fa57600080fd5b5061031560048036038101906103109190611eaa565b61119e565b60405161032291906125dc565b60405180910390f35b34801561033757600080fd5b506103406111c2565b60405161034d91906125dc565b60405180910390f35b34801561036257600080fd5b5061037d600480360381019061037891906125f7565b6111ce565b005b806000600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600582018054806020026020016040519081016040528092919081815260200182805480156104a357602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610459575b505050505081526020016006820160009054906101000a900460ff1660028111156104d1576104d061243f565b5b60028111156104e3576104e261243f565b5b815250509050600081600001511415610528576040517f0d294f3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600060036000858152602001908152602001600020905061054c8160020154611475565b61055c81600501805490506114b2565b6105768160060160009054906101000a900460ff166114f0565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635d3b1d30600854600160149054906101000a900467ffffffffffffffff166003620186a060016040518663ffffffff1660e01b81526004016105f895949392919061268c565b602060405180830381600087803b15801561061257600080fd5b505af1158015610626573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064a91906126f4565b905084600460008381526020019081526020016000208190555060018260060160006101000a81548160ff0219169083600281111561068c5761068b61243f565b5b021790555080857f708691262b677612d65fe057f7788158f3bfedcc25f9d7b50adaa889b0048ace60405160405180910390a35050505050565b600160149054906101000a900467ffffffffffffffff1681565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461079257337f00000000000000000000000000000000000000000000000000000000000000006040517f1cf993f4000000000000000000000000000000000000000000000000000000008152600401610789929190612721565b60405180910390fd5b61079c8282611551565b5050565b600082828101906107b19190611eaa565b90506000600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600582018054806020026020016040519081016040528092919081815260200182805480156108d657602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161088c575b505050505081526020016006820160009054906101000a900460ff1660028111156109045761090361243f565b5b60028111156109165761091561243f565b5b81525050905061092581611a07565b15610934576109338261037f565b5b50505050565b6000606060008060405180602001604052806000815250905060005b600680549050811015610b39576000600682815481106109795761097861274a565b5b906000526020600020015490506000600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015610aa957602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610a5f575b505050505081526020016006820160009054906101000a900460ff166002811115610ad757610ad661243f565b5b6002811115610ae957610ae861243f565b5b815250509050610af881611a07565b15610b24576001945081604051602001610b1291906125dc565b60405160208183030381529060405293505b50508080610b31906127a8565b915050610956565b5081819350935050509250929050565b60606006805480602002602001604051908101604052809291908181526020018280548015610b9757602002820191906000526020600020905b815481526020019060010190808311610b83575b5050505050905090565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610c29576040517fb8ea493b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b806000600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015610d4d57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610d03575b505050505081526020016006820160009054906101000a900460ff166002811115610d7b57610d7a61243f565b5b6002811115610d8d57610d8c61243f565b5b815250509050600081600001511415610dd2576040517f0d294f3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600360008581526020019081526020016000209050610df284611a5c565b610e0c8160060160009054906101000a900460ff166114f0565b610e198160010154611c79565b80600501339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034816003016000828254610e9291906127f1565b92505081905550600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208490806001815401808255809150506001900390600052602060002001600090919091909150553373ffffffffffffffffffffffffffffffffffffffff16847f6c99a0dcc97bf964290aa2caae5586725125e73a4d885d742a168903403dc06e60405160405180910390a350505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610f77611d54565b600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820180548060200260200160405190810160405280929190818152602001828054801561109857602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161104e575b505050505081526020016006820160009054906101000a900460ff1660028111156110c6576110c561243f565b5b60028111156110d8576110d761243f565b5b815250509050919050565b6060600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561116e57602002820191906000526020600020905b81548152602001906001019080831161115a575b50505050509050919050565b6006818154811061118a57600080fd5b906000526020600020016000915090505481565b600781815481106111ae57600080fd5b906000526020600020016000915090505481565b60008060000154905081565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611255576040517f3e8be92f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61125e82611cb5565b61126781611cf2565b6000814261127591906127f1565b90506112816000611d30565b600061128d6000611d46565b905060008067ffffffffffffffff8111156112ab576112aa611f2b565b5b6040519080825280602002602001820160405280156112d95781602001602082028036833780820191505090505b5090506040518060e0016040528083815260200186815260200184815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001828152602001600060028111156113375761133661243f565b5b815250600360008481526020019081526020016000206000820151816000015560208201518160010155604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a08201518160050190805190602001906113d8929190611db9565b5060c08201518160060160006101000a81548160ff021916908360028111156114045761140361243f565b5b0217905550905050600682908060018154018082558091505060019003906000526020600020016000909190919091505584827fbcab9af3175c8a9d53b9308a82ee378a84c65b0c22e3dfea2afac802c73a078a8560405161146691906125dc565b60405180910390a35050505050565b428111156114af576040517fd9b64fdd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b60028110156114ed576040517f99f46cd500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b600060028111156115045761150361243f565b5b8160028111156115175761151661243f565b5b1461154e576040517f4174a35500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b600060046000848152602001908152602001600020549050600060036000838152602001908152602001600020905060008160050180548060200260200160405190810160405280929190818152602001828054801561160657602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116115bc575b505050505090506000818251866000815181106116265761162561274a565b5b60200260200101516116389190612876565b815181106116495761164861274a565b5b60200260200101519050808360040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008173ffffffffffffffffffffffffffffffffffffffff1684600301546040516116c0906128d8565b60006040518083038185875af1925050503d80600081146116fd576040519150601f19603f3d011682016040523d82523d6000602084013e611702565b606091505b505090508061173d576040517f192c630600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60028460060160006101000a81548160ff021916908360028111156117655761176461243f565b5b021790555060005b6006805490508110156119a2576000600682815481106117905761178f61274a565b5b906000526020600020015490506000600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600582018054806020026020016040519081016040528092919081815260200182805480156118c057602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611876575b505050505081526020016006820160009054906101000a900460ff1660028111156118ee576118ed61243f565b5b6002811115611900576118ff61243f565b5b815250509050806000015188141561198d576006600160068054905061192691906128ed565b815481106119375761193661274a565b5b9060005260206000200154600684815481106119565761195561274a565b5b9060005260206000200181905550600680548061197657611975612921565b5b600190038181906000526020600020016000905590555b5050808061199a906127a8565b91505061176d565b508173ffffffffffffffffffffffffffffffffffffffff16857f4d3647387a0671b375a6cfb75769ed74ec10d3a37f6d3b392b12926fe9a099d160405160405180910390a3600460008881526020019081526020016000206000905550505050505050565b6000428260400151108015611a44575060006002811115611a2b57611a2a61243f565b5b8260c001516002811115611a4257611a4161243f565b5b145b8015611a55575060018260a0015151115b9050919050565b6000600360008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015611b7f57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611b35575b505050505081526020016006820160009054906101000a900460ff166002811115611bad57611bac61243f565b5b6002811115611bbf57611bbe61243f565b5b81525050905060008160a001519050600033905060005b8251811015611c7257828181518110611bf257611bf161274a565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611c5f576040517fbb25dcac00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8080611c6a906127a8565b915050611bd6565b5050505050565b803414611cb2576040517f7289b57300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b60008111611cef576040517f114eafc600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b603c811015611d2d576040517fe2f2556e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b6001816000016000828254019250508190555050565b600081600001549050919050565b6040518060e0016040528060008152602001600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160006002811115611db357611db261243f565b5b81525090565b828054828255906000526020600020908101928215611e32579160200282015b82811115611e315782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190611dd9565b5b509050611e3f9190611e43565b5090565b5b80821115611e5c576000816000905550600101611e44565b5090565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b611e8781611e74565b8114611e9257600080fd5b50565b600081359050611ea481611e7e565b92915050565b600060208284031215611ec057611ebf611e6a565b5b6000611ece84828501611e95565b91505092915050565b600067ffffffffffffffff82169050919050565b611ef481611ed7565b82525050565b6000602082019050611f0f6000830184611eeb565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611f6382611f1a565b810181811067ffffffffffffffff82111715611f8257611f81611f2b565b5b80604052505050565b6000611f95611e60565b9050611fa18282611f5a565b919050565b600067ffffffffffffffff821115611fc157611fc0611f2b565b5b602082029050602081019050919050565b600080fd5b6000611fea611fe584611fa6565b611f8b565b9050808382526020820190506020840283018581111561200d5761200c611fd2565b5b835b8181101561203657806120228882611e95565b84526020840193505060208101905061200f565b5050509392505050565b600082601f83011261205557612054611f15565b5b8135612065848260208601611fd7565b91505092915050565b6000806040838503121561208557612084611e6a565b5b600061209385828601611e95565b925050602083013567ffffffffffffffff8111156120b4576120b3611e6f565b5b6120c085828601612040565b9150509250929050565b600080fd5b60008083601f8401126120e5576120e4611f15565b5b8235905067ffffffffffffffff811115612102576121016120ca565b5b60208301915083600182028301111561211e5761211d611fd2565b5b9250929050565b6000806020838503121561213c5761213b611e6a565b5b600083013567ffffffffffffffff81111561215a57612159611e6f565b5b612166858286016120cf565b92509250509250929050565b60008115159050919050565b61218781612172565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156121c75780820151818401526020810190506121ac565b838111156121d6576000848401525b50505050565b60006121e78261218d565b6121f18185612198565b93506122018185602086016121a9565b61220a81611f1a565b840191505092915050565b600060408201905061222a600083018561217e565b818103602083015261223c81846121dc565b90509392505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61227a81611e74565b82525050565b600061228c8383612271565b60208301905092915050565b6000602082019050919050565b60006122b082612245565b6122ba8185612250565b93506122c583612261565b8060005b838110156122f65781516122dd8882612280565b97506122e883612298565b9250506001810190506122c9565b5085935050505092915050565b6000602082019050818103600083015261231d81846122a5565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061235082612325565b9050919050565b61236081612345565b82525050565b600060208201905061237b6000830184612357565b92915050565b61238a81612345565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60006123c88383612381565b60208301905092915050565b6000602082019050919050565b60006123ec82612390565b6123f6818561239b565b9350612401836123ac565b8060005b8381101561243257815161241988826123bc565b9750612424836123d4565b925050600181019050612405565b5085935050505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6003811061247f5761247e61243f565b5b50565b60008190506124908261246e565b919050565b60006124a082612482565b9050919050565b6124b081612495565b82525050565b600060e0830160008301516124ce6000860182612271565b5060208301516124e16020860182612271565b5060408301516124f46040860182612271565b5060608301516125076060860182612271565b50608083015161251a6080860182612381565b5060a083015184820360a086015261253282826123e1565b91505060c083015161254760c08601826124a7565b508091505092915050565b6000602082019050818103600083015261256c81846124b6565b905092915050565b61257d81612345565b811461258857600080fd5b50565b60008135905061259a81612574565b92915050565b6000602082840312156125b6576125b5611e6a565b5b60006125c48482850161258b565b91505092915050565b6125d681611e74565b82525050565b60006020820190506125f160008301846125cd565b92915050565b6000806040838503121561260e5761260d611e6a565b5b600061261c85828601611e95565b925050602061262d85828601611e95565b9150509250929050565b6000819050919050565b61264a81612637565b82525050565b600061ffff82169050919050565b61266781612650565b82525050565b600063ffffffff82169050919050565b6126868161266d565b82525050565b600060a0820190506126a16000830188612641565b6126ae6020830187611eeb565b6126bb604083018661265e565b6126c8606083018561267d565b6126d5608083018461267d565b9695505050505050565b6000815190506126ee81611e7e565b92915050565b60006020828403121561270a57612709611e6a565b5b6000612718848285016126df565b91505092915050565b60006040820190506127366000830185612357565b6127436020830184612357565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006127b382611e74565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156127e6576127e5612779565b5b600182019050919050565b60006127fc82611e74565b915061280783611e74565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561283c5761283b612779565b5b828201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061288182611e74565b915061288c83611e74565b92508261289c5761289b612847565b5b828206905092915050565b600081905092915050565b50565b60006128c26000836128a7565b91506128cd826128b2565b600082019050919050565b60006128e3826128b5565b9150819050919050565b60006128f882611e74565b915061290383611e74565b92508282101561291657612915612779565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220e2c626d14f93a90d9fee8a6fcbe1974b60f5f12d4de42e821eefab7ee2c5799164736f6c63430008090033";

type LotteryGameConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LotteryGameConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LotteryGame__factory extends ContractFactory {
  constructor(...args: LotteryGameConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _vrfCoordinatorAddress: PromiseOrValue<string>,
    _keyHash: PromiseOrValue<BytesLike>,
    _subscriptionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LotteryGame> {
    return super.deploy(
      _vrfCoordinatorAddress,
      _keyHash,
      _subscriptionId,
      overrides || {}
    ) as Promise<LotteryGame>;
  }
  override getDeployTransaction(
    _vrfCoordinatorAddress: PromiseOrValue<string>,
    _keyHash: PromiseOrValue<BytesLike>,
    _subscriptionId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _vrfCoordinatorAddress,
      _keyHash,
      _subscriptionId,
      overrides || {}
    );
  }
  override attach(address: string): LotteryGame {
    return super.attach(address) as LotteryGame;
  }
  override connect(signer: Signer): LotteryGame__factory {
    return super.connect(signer) as LotteryGame__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LotteryGameInterface {
    return new utils.Interface(_abi) as LotteryGameInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LotteryGame {
    return new Contract(address, _abi, signerOrProvider) as LotteryGame;
  }
}
