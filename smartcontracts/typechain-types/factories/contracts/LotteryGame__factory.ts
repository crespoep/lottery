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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
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
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162002d1938038062002d19833981810160405281019062000037919062000211565b828073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505082600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600181905550806000806101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050506200026d565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000159826200012c565b9050919050565b6200016b816200014c565b81146200017757600080fd5b50565b6000815190506200018b8162000160565b92915050565b6000819050919050565b620001a68162000191565b8114620001b257600080fd5b50565b600081519050620001c6816200019b565b92915050565b600067ffffffffffffffff82169050919050565b620001eb81620001cc565b8114620001f757600080fd5b50565b6000815190506200020b81620001e0565b92915050565b6000806000606084860312156200022d576200022c62000127565b5b60006200023d868287016200017a565b93505060206200025086828701620001b5565b92505060406200026386828701620001fa565b9150509250925092565b608051612a89620002906000396000818161070001526107540152612a896000f3fe6080604052600436106100e75760003560e01c806382d63ee61161008a5780639384c39d116100595780639384c39d146102d3578063beff730f14610310578063e580f47b1461034d578063fe35804e14610378576100e7565b806382d63ee614610224578063845c93061461024f5780638da5cb5b1461026b57806392e845f614610296576100e7565b806327e235e3116100c657806327e235e3146101695780633ccfd60b146101a65780634585e33b146101bd5780636e04ff0d146101e6576100e7565b8062c2943c146100ec57806309c1ba2e146101155780631fe543e314610140575b600080fd5b3480156100f857600080fd5b50610113600480360381019061010e9190611fad565b6103a1565b005b34801561012157600080fd5b5061012a6106e6565b6040516101379190611ffd565b60405180910390f35b34801561014c57600080fd5b5061016760048036038101906101629190612171565b6106fe565b005b34801561017557600080fd5b50610190600480360381019061018b919061222b565b6107be565b60405161019d9190612267565b60405180910390f35b3480156101b257600080fd5b506101bb6107d6565b005b3480156101c957600080fd5b506101e460048036038101906101df91906122dd565b6108d8565b005b3480156101f257600080fd5b5061020d600480360381019061020891906122dd565b610a72565b60405161021b9291906123cd565b60405180910390f35b34801561023057600080fd5b50610239610c7a565b60405161024691906124bb565b60405180910390f35b61026960048036038101906102649190611fad565b610c8b565b005b34801561027757600080fd5b50610280611033565b60405161028d91906124ec565b60405180910390f35b3480156102a257600080fd5b506102bd60048036038101906102b89190611fad565b611059565b6040516102ca91906126d8565b60405180910390f35b3480156102df57600080fd5b506102fa60048036038101906102f5919061222b565b6111cd565b60405161030791906124bb565b60405180910390f35b34801561031c57600080fd5b5061033760048036038101906103329190611fad565b611264565b6040516103449190612267565b60405180910390f35b34801561035957600080fd5b50610362611288565b60405161036f9190612267565b60405180910390f35b34801561038457600080fd5b5061039f600480360381019061039a91906126fa565b611294565b005b806000600560008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600582018054806020026020016040519081016040528092919081815260200182805480156104c557602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161047b575b505050505081526020016006820160009054906101000a900460ff1660028111156104f3576104f26125c5565b5b6002811115610505576105046125c5565b5b81525050905060008160000151141561054a576040517f0d294f3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600060056000858152602001908152602001600020905061057b8160060160009054906101000a900460ff16611527565b6105888160020154611588565b61059881600501805490506115c5565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635d3b1d3060015460008054906101000a900467ffffffffffffffff166003620186a060016040518663ffffffff1660e01b815260040161061895949392919061278f565b602060405180830381600087803b15801561063257600080fd5b505af1158015610646573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066a91906127f7565b905084600660008381526020019081526020016000208190555060018260060160006101000a81548160ff021916908360028111156106ac576106ab6125c5565b5b021790555080857f708691262b677612d65fe057f7788158f3bfedcc25f9d7b50adaa889b0048ace60405160405180910390a35050505050565b60008054906101000a900467ffffffffffffffff1681565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107b057337f00000000000000000000000000000000000000000000000000000000000000006040517f1cf993f40000000000000000000000000000000000000000000000000000000081526004016107a7929190612824565b60405180910390fd5b6107ba8282611603565b5050565b60086020528060005260406000206000915090505481565b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000811161082757600080fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16816040516108909061287e565b60006040518083038185875af1925050503d80600081146108cd576040519150601f19603f3d011682016040523d82523d6000602084013e6108d2565b606091505b50505050565b600082828101906108e99190611fad565b90506000600560008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015610a0e57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116109c4575b505050505081526020016006820160009054906101000a900460ff166002811115610a3c57610a3b6125c5565b5b6002811115610a4e57610a4d6125c5565b5b815250509050610a5d81611847565b15610a6c57610a6b826103a1565b5b50505050565b6000606060008060405180602001604052806000815250905060005b610a98600961189c565b811015610c6a576000610ab58260096118b190919063ffffffff16565b90506000600560008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015610bda57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610b90575b505050505081526020016006820160009054906101000a900460ff166002811115610c0857610c076125c5565b5b6002811115610c1a57610c196125c5565b5b815250509050610c2981611847565b15610c55576001945081604051602001610c439190612267565b60405160208183030381529060405293505b50508080610c62906128c2565b915050610a8e565b5081819350935050509250929050565b6060610c8660096118cb565b905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610d13576040517fb8ea493b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b806000600560008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015610e3757602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610ded575b505050505081526020016006820160009054906101000a900460ff166002811115610e6557610e646125c5565b5b6002811115610e7757610e766125c5565b5b815250509050600081600001511415610ebc576040517f0d294f3400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600560008581526020019081526020016000209050610edc846118ec565b610ef68160060160009054906101000a900460ff16611527565b610f038160010154611b09565b80600501339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034816003016000828254610f7c919061290b565b92505081905550600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208490806001815401808255809150506001900390600052602060002001600090919091909150553373ffffffffffffffffffffffffffffffffffffffff16847f6c99a0dcc97bf964290aa2caae5586725125e73a4d885d742a168903403dc06e60405160405180910390a350505050565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611061611e57565b600560008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016005820180548060200260200160405190810160405280929190818152602001828054801561118257602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311611138575b505050505081526020016006820160009054906101000a900460ff1660028111156111b0576111af6125c5565b5b60028111156111c2576111c16125c5565b5b815250509050919050565b6060600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561125857602002820191906000526020600020905b815481526020019060010190808311611244575b50505050509050919050565b600b818154811061127457600080fd5b906000526020600020016000915090505481565b60028060000154905081565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461131b576040517f3e8be92f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61132482611b45565b61132d81611b82565b6000814261133b919061290b565b90506113476002611bc0565b60006113536002611bd6565b905060008067ffffffffffffffff8111156113715761137061202e565b5b60405190808252806020026020018201604052801561139f5781602001602082028036833780820191505090505b5090506040518060e0016040528083815260200186815260200184815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001828152602001600060028111156113fd576113fc6125c5565b5b815250600560008481526020019081526020016000206000820151816000015560208201518160010155604082015181600201556060820151816003015560808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060a082015181600501908051906020019061149e929190611ebc565b5060c08201518160060160006101000a81548160ff021916908360028111156114ca576114c96125c5565b5b02179055509050506114e6826009611be490919063ffffffff16565b5084827fbcab9af3175c8a9d53b9308a82ee378a84c65b0c22e3dfea2afac802c73a078a856040516115189190612267565b60405180910390a35050505050565b6000600281111561153b5761153a6125c5565b5b81600281111561154e5761154d6125c5565b5b14611585576040517f4174a35500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b428111156115c2576040517fd9b64fdd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b6002811015611600576040517f99f46cd500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b60006006600084815260200190815260200160002054905060006005600083815260200190815260200160002090506000816005018054806020026020016040519081016040528092919081815260200182805480156116b857602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161166e575b505050505090506000818251866000815181106116d8576116d7612961565b5b60200260200101516116ea91906129bf565b815181106116fb576116fa612961565b5b60200260200101519050808360040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260030154600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461179b919061290b565b9250508190555060028360060160006101000a81548160ff021916908360028111156117ca576117c96125c5565b5b02179055506117e3846009611bfe90919063ffffffff16565b508073ffffffffffffffffffffffffffffffffffffffff16847f4d3647387a0671b375a6cfb75769ed74ec10d3a37f6d3b392b12926fe9a099d160405160405180910390a36006600087815260200190815260200160002060009055505050505050565b600042826040015110801561188457506000600281111561186b5761186a6125c5565b5b8260c001516002811115611882576118816125c5565b5b145b8015611895575060018260a0015151115b9050919050565b60006118aa82600001611c18565b9050919050565b60006118c08360000183611c29565b60001c905092915050565b606060006118db83600001611c54565b905060608190508092505050919050565b6000600560008381526020019081526020016000206040518060e0016040529081600082015481526020016001820154815260200160028201548152602001600382015481526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160058201805480602002602001604051908101604052809291908181526020018280548015611a0f57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116119c5575b505050505081526020016006820160009054906101000a900460ff166002811115611a3d57611a3c6125c5565b5b6002811115611a4f57611a4e6125c5565b5b81525050905060008160a001519050600033905060005b8251811015611b0257828181518110611a8257611a81612961565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611aef576040517fbb25dcac00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8080611afa906128c2565b915050611a66565b5050505050565b803414611b42576040517f7289b57300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b60008111611b7f576040517f114eafc600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b603c811015611bbd576040517fe2f2556e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b6001816000016000828254019250508190555050565b600081600001549050919050565b6000611bf6836000018360001b611cb0565b905092915050565b6000611c10836000018360001b611d20565b905092915050565b600081600001805490509050919050565b6000826000018281548110611c4157611c40612961565b5b9060005260206000200154905092915050565b606081600001805480602002602001604051908101604052809291908181526020018280548015611ca457602002820191906000526020600020905b815481526020019060010190808311611c90575b50505050509050919050565b6000611cbc8383611e34565b611d15578260000182908060018154018082558091505060019003906000526020600020016000909190919091505582600001805490508360010160008481526020019081526020016000208190555060019050611d1a565b600090505b92915050565b60008083600101600084815260200190815260200160002054905060008114611e28576000600182611d5291906129f0565b9050600060018660000180549050611d6a91906129f0565b9050818114611dd9576000866000018281548110611d8b57611d8a612961565b5b9060005260206000200154905080876000018481548110611daf57611dae612961565b5b90600052602060002001819055508387600101600083815260200190815260200160002081905550505b85600001805480611ded57611dec612a24565b5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050611e2e565b60009150505b92915050565b600080836001016000848152602001908152602001600020541415905092915050565b6040518060e0016040528060008152602001600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160006002811115611eb657611eb56125c5565b5b81525090565b828054828255906000526020600020908101928215611f35579160200282015b82811115611f345782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190611edc565b5b509050611f429190611f46565b5090565b5b80821115611f5f576000816000905550600101611f47565b5090565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b611f8a81611f77565b8114611f9557600080fd5b50565b600081359050611fa781611f81565b92915050565b600060208284031215611fc357611fc2611f6d565b5b6000611fd184828501611f98565b91505092915050565b600067ffffffffffffffff82169050919050565b611ff781611fda565b82525050565b60006020820190506120126000830184611fee565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6120668261201d565b810181811067ffffffffffffffff821117156120855761208461202e565b5b80604052505050565b6000612098611f63565b90506120a4828261205d565b919050565b600067ffffffffffffffff8211156120c4576120c361202e565b5b602082029050602081019050919050565b600080fd5b60006120ed6120e8846120a9565b61208e565b905080838252602082019050602084028301858111156121105761210f6120d5565b5b835b8181101561213957806121258882611f98565b845260208401935050602081019050612112565b5050509392505050565b600082601f83011261215857612157612018565b5b81356121688482602086016120da565b91505092915050565b6000806040838503121561218857612187611f6d565b5b600061219685828601611f98565b925050602083013567ffffffffffffffff8111156121b7576121b6611f72565b5b6121c385828601612143565b9150509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006121f8826121cd565b9050919050565b612208816121ed565b811461221357600080fd5b50565b600081359050612225816121ff565b92915050565b60006020828403121561224157612240611f6d565b5b600061224f84828501612216565b91505092915050565b61226181611f77565b82525050565b600060208201905061227c6000830184612258565b92915050565b600080fd5b60008083601f84011261229d5761229c612018565b5b8235905067ffffffffffffffff8111156122ba576122b9612282565b5b6020830191508360018202830111156122d6576122d56120d5565b5b9250929050565b600080602083850312156122f4576122f3611f6d565b5b600083013567ffffffffffffffff81111561231257612311611f72565b5b61231e85828601612287565b92509250509250929050565b60008115159050919050565b61233f8161232a565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561237f578082015181840152602081019050612364565b8381111561238e576000848401525b50505050565b600061239f82612345565b6123a98185612350565b93506123b9818560208601612361565b6123c28161201d565b840191505092915050565b60006040820190506123e26000830185612336565b81810360208301526123f48184612394565b90509392505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61243281611f77565b82525050565b60006124448383612429565b60208301905092915050565b6000602082019050919050565b6000612468826123fd565b6124728185612408565b935061247d83612419565b8060005b838110156124ae5781516124958882612438565b97506124a083612450565b925050600181019050612481565b5085935050505092915050565b600060208201905081810360008301526124d5818461245d565b905092915050565b6124e6816121ed565b82525050565b600060208201905061250160008301846124dd565b92915050565b612510816121ed565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600061254e8383612507565b60208301905092915050565b6000602082019050919050565b600061257282612516565b61257c8185612521565b935061258783612532565b8060005b838110156125b857815161259f8882612542565b97506125aa8361255a565b92505060018101905061258b565b5085935050505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60038110612605576126046125c5565b5b50565b6000819050612616826125f4565b919050565b600061262682612608565b9050919050565b6126368161261b565b82525050565b600060e0830160008301516126546000860182612429565b5060208301516126676020860182612429565b50604083015161267a6040860182612429565b50606083015161268d6060860182612429565b5060808301516126a06080860182612507565b5060a083015184820360a08601526126b88282612567565b91505060c08301516126cd60c086018261262d565b508091505092915050565b600060208201905081810360008301526126f2818461263c565b905092915050565b6000806040838503121561271157612710611f6d565b5b600061271f85828601611f98565b925050602061273085828601611f98565b9150509250929050565b6000819050919050565b61274d8161273a565b82525050565b600061ffff82169050919050565b61276a81612753565b82525050565b600063ffffffff82169050919050565b61278981612770565b82525050565b600060a0820190506127a46000830188612744565b6127b16020830187611fee565b6127be6040830186612761565b6127cb6060830185612780565b6127d86080830184612780565b9695505050505050565b6000815190506127f181611f81565b92915050565b60006020828403121561280d5761280c611f6d565b5b600061281b848285016127e2565b91505092915050565b600060408201905061283960008301856124dd565b61284660208301846124dd565b9392505050565b600081905092915050565b50565b600061286860008361284d565b915061287382612858565b600082019050919050565b60006128898261285b565b9150819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006128cd82611f77565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612900576128ff612893565b5b600182019050919050565b600061291682611f77565b915061292183611f77565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561295657612955612893565b5b828201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006129ca82611f77565b91506129d583611f77565b9250826129e5576129e4612990565b5b828206905092915050565b60006129fb82611f77565b9150612a0683611f77565b925082821015612a1957612a18612893565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea264697066735822122017ee7ce271c19877fd259b16c31b0c42c260a25e3229899e70cbc86acb99903364736f6c63430008090033";

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
