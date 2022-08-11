/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  VRFCoordinatorV2Mock,
  VRFCoordinatorV2MockInterface,
} from "../../../contracts/mocks/VRFCoordinatorV2Mock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_baseFee",
        type: "uint96",
      },
      {
        internalType: "uint96",
        name: "_gasPriceLink",
        type: "uint96",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSubscription",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "MustBeSubOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputSeed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "payment",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "RandomWordsFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "keyHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "preSeed",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "subId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "minimumRequestConfirmations",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "callbackGasLimit",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "numWords",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RandomWordsRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SubscriptionCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "SubscriptionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "SubscriptionFunded",
    type: "event",
  },
  {
    inputs: [],
    name: "BASE_FEE",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GAS_PRICE_LINK",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
    ],
    name: "acceptSubscriptionOwnerTransfer",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_consumer",
        type: "address",
      },
    ],
    name: "addConsumer",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "cancelSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "createSubscription",
    outputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_consumer",
        type: "address",
      },
    ],
    name: "fulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "uint96",
        name: "_amount",
        type: "uint96",
      },
    ],
    name: "fundSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getRequestConfig",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
    ],
    name: "getSubscription",
    outputs: [
      {
        internalType: "uint96",
        name: "balance",
        type: "uint96",
      },
      {
        internalType: "uint64",
        name: "reqCount",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "consumers",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_consumer",
        type: "address",
      },
    ],
    name: "removeConsumer",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_keyHash",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "_minimumRequestConfirmations",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "_callbackGasLimit",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "_numWords",
        type: "uint32",
      },
    ],
    name: "requestRandomWords",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "requestSubscriptionOwnerTransfer",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040526001805560646002553480156200001a57600080fd5b5060405162001fc238038062001fc28339818101604052810190620000409190620000de565b816bffffffffffffffffffffffff166080816bffffffffffffffffffffffff1681525050806bffffffffffffffffffffffff1660a0816bffffffffffffffffffffffff1681525050505062000125565b600080fd5b60006bffffffffffffffffffffffff82169050919050565b620000b88162000095565b8114620000c457600080fd5b50565b600081519050620000d881620000ad565b92915050565b60008060408385031215620000f857620000f762000090565b5b60006200010885828601620000c7565b92505060206200011b85828601620000c7565b9150509250929050565b60805160a051611e69620001596000396000818161081a0152610c8a015260008181610311015261085f0152611e696000f3fe608060405234801561001057600080fd5b50600436106100ce5760003560e01c8063823597401161008c578063a410347f11610066578063a410347f146101eb578063a47c769614610209578063afc69b531461023c578063d7ae1d3014610258576100ce565b806382359740146101955780639f87fad7146101b1578063a21a23e4146101cd576100ce565b8062012291146100d357806304c357cb146100f35780633d18651e1461010f5780635d3b1d301461012d5780637341c10c1461015d578063808974ff14610179575b600080fd5b6100db610274565b6040516100ea9392919061133f565b60405180910390f35b61010d60048036038101906101089190611420565b6102d4565b005b61011761030f565b6040516101249190611487565b60405180910390f35b61014760048036038101906101429190611526565b610333565b60405161015491906115ba565b60405180910390f35b61017760048036038101906101729190611420565b61054f565b005b610193600480360381019061018e9190611601565b61058a565b005b6101af60048036038101906101aa9190611641565b610a5d565b005b6101cb60048036038101906101c69190611420565b610a98565b005b6101d5610ad3565b6040516101e2919061167d565b60405180910390f35b6101f3610c88565b6040516102009190611487565b60405180910390f35b610223600480360381019061021e9190611641565b610cac565b6040516102339493929190611765565b60405180910390f35b610256600480360381019061025191906117dd565b610e4d565b005b610272600480360381019061026d9190611420565b611018565b005b60008060606003621e8480600067ffffffffffffffff81111561029a5761029961181d565b5b6040519080825280602002602001820160405280156102c85781602001602082028036833780820191505090505b50925092509250909192565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610306906118a9565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000081565b60008073ffffffffffffffffffffffffffffffffffffffff16600360008767ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156103e5576040517f1f6a65b600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600160008154809291906103fa906118f8565b919050559050600060026000815480929190610415906118f8565b91905055905060405180606001604052808867ffffffffffffffff1681526020018663ffffffff1681526020018563ffffffff168152506004600084815260200190815260200160002060008201518160000160006101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060208201518160000160086101000a81548163ffffffff021916908363ffffffff160217905550604082015181600001600c6101000a81548163ffffffff021916908363ffffffff1602179055509050503373ffffffffffffffffffffffffffffffffffffffff168767ffffffffffffffff16897f63373d1c4696214b898952999c9aaec57dac1ee2723cec59bea6888f489a977285858b8b8b604051610539959493929190611941565b60405180910390a4819250505095945050505050565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610581906118a9565b60405180910390fd5b60005a905060006004600085815260200190815260200160002060000160009054906101000a900467ffffffffffffffff1667ffffffffffffffff161415610607576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105fe906119e0565b60405180910390fd5b6000600460008581526020019081526020016000206040518060600160405290816000820160009054906101000a900467ffffffffffffffff1667ffffffffffffffff1667ffffffffffffffff1681526020016000820160089054906101000a900463ffffffff1663ffffffff1663ffffffff16815260200160008201600c9054906101000a900463ffffffff1663ffffffff1663ffffffff168152505090506000816040015163ffffffff1667ffffffffffffffff8111156106cd576106cc61181d565b5b6040519080825280602002602001820160405280156106fb5781602001602082028036833780820191505090505b50905060058160008151811061071457610713611a00565b5b602002602001018181525050600080631fe543e360e01b878460405160240161073e929190611aed565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050905060008673ffffffffffffffffffffffffffffffffffffffff16856020015163ffffffff16836040516107cf9190611b97565b60006040518083038160008787f1925050503d806000811461080d576040519150601f19603f3d011682016040523d82523d6000602084013e610812565b606091505b5050905060007f00000000000000000000000000000000000000000000000000000000000000006bffffffffffffffffffffffff165a886108539190611bae565b61085d9190611be2565b7f00000000000000000000000000000000000000000000000000000000000000006bffffffffffffffffffffffff166108969190611c3c565b9050806bffffffffffffffffffffffff1660036000886000015167ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160149054906101000a90046bffffffffffffffffffffffff166bffffffffffffffffffffffff161015610934576040517ff4d678b800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8060036000886000015167ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160148282829054906101000a90046bffffffffffffffffffffffff166109899190611c92565b92506101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff160217905550600460008a8152602001908152602001600020600080820160006101000a81549067ffffffffffffffff02191690556000820160086101000a81549063ffffffff021916905560008201600c6101000a81549063ffffffff02191690555050887f7dffc5ae5ee4e2e4df1651cf6ad329a73cebdb728f37ea0187b9b17e036756e48a8385604051610a4a93929190611ce1565b60405180910390a2505050505050505050565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a8f906118a9565b60405180910390fd5b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aca906118a9565b60405180910390fd5b600080600081819054906101000a900467ffffffffffffffff1680929190610afa90611d18565b91906101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055505060405180604001604052803373ffffffffffffffffffffffffffffffffffffffff16815260200160006bffffffffffffffffffffffff16815250600360008060009054906101000a900467ffffffffffffffff1667ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff16021790555090505060008054906101000a900467ffffffffffffffff1667ffffffffffffffff167f464722b4166576d3dcbba877b999bc35cf911f4eaf434b7eba68fa113951d0bf33604051610c669190611d49565b60405180910390a260008054906101000a900467ffffffffffffffff16905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008060006060600073ffffffffffffffffffffffffffffffffffffffff16600360008767ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610d64576040517f1f6a65b600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600360008667ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160149054906101000a90046bffffffffffffffffffffffff166000600360008867ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600067ffffffffffffffff811115610e0f57610e0e61181d565b5b604051908082528060200260200182016040528015610e3d5781602001602082028036833780820191505090505b5093509350935093509193509193565b600073ffffffffffffffffffffffffffffffffffffffff16600360008467ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610efe576040517f1f6a65b600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600360008467ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160149054906101000a90046bffffffffffffffffffffffff16905081600360008567ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160148282829054906101000a90046bffffffffffffffffffffffff16610f969190611d64565b92506101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff1602179055508267ffffffffffffffff167fd39ec07f4e209f627a4c427971473820dc129761ba28de8906bd56f57101d4f8828484610ffd9190611d64565b60405161100b929190611de1565b60405180910390a2505050565b816000600360008367ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156110cf576040517f1f6a65b600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461113f57806040517fd8a3fb520000000000000000000000000000000000000000000000000000000081526004016111369190611d49565b60405180910390fd5b8367ffffffffffffffff167fe8ed5b475a5b5987aa9165e8731bb78043f39eee32ec5a1169a89e27fcd4981584600360008867ffffffffffffffff1667ffffffffffffffff16815260200190815260200160002060000160149054906101000a90046bffffffffffffffffffffffff166040516111bd929190611e0a565b60405180910390a2600360008567ffffffffffffffff1667ffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a8154906bffffffffffffffffffffffff0219169055505050505050565b600061ffff82169050919050565b6112528161123b565b82525050565b600063ffffffff82169050919050565b61127181611258565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000819050919050565b6112b6816112a3565b82525050565b60006112c883836112ad565b60208301905092915050565b6000602082019050919050565b60006112ec82611277565b6112f68185611282565b935061130183611293565b8060005b8381101561133257815161131988826112bc565b9750611324836112d4565b925050600181019050611305565b5085935050505092915050565b60006060820190506113546000830186611249565b6113616020830185611268565b818103604083015261137381846112e1565b9050949350505050565b600080fd5b600067ffffffffffffffff82169050919050565b61139f81611382565b81146113aa57600080fd5b50565b6000813590506113bc81611396565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006113ed826113c2565b9050919050565b6113fd816113e2565b811461140857600080fd5b50565b60008135905061141a816113f4565b92915050565b600080604083850312156114375761143661137d565b5b6000611445858286016113ad565b92505060206114568582860161140b565b9150509250929050565b60006bffffffffffffffffffffffff82169050919050565b61148181611460565b82525050565b600060208201905061149c6000830184611478565b92915050565b6114ab816112a3565b81146114b657600080fd5b50565b6000813590506114c8816114a2565b92915050565b6114d78161123b565b81146114e257600080fd5b50565b6000813590506114f4816114ce565b92915050565b61150381611258565b811461150e57600080fd5b50565b600081359050611520816114fa565b92915050565b600080600080600060a086880312156115425761154161137d565b5b6000611550888289016114b9565b9550506020611561888289016113ad565b9450506040611572888289016114e5565b935050606061158388828901611511565b925050608061159488828901611511565b9150509295509295909350565b6000819050919050565b6115b4816115a1565b82525050565b60006020820190506115cf60008301846115ab565b92915050565b6115de816115a1565b81146115e957600080fd5b50565b6000813590506115fb816115d5565b92915050565b600080604083850312156116185761161761137d565b5b6000611626858286016115ec565b92505060206116378582860161140b565b9150509250929050565b6000602082840312156116575761165661137d565b5b6000611665848285016113ad565b91505092915050565b61167781611382565b82525050565b6000602082019050611692600083018461166e565b92915050565b6116a1816113e2565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6116dc816113e2565b82525050565b60006116ee83836116d3565b60208301905092915050565b6000602082019050919050565b6000611712826116a7565b61171c81856116b2565b9350611727836116c3565b8060005b8381101561175857815161173f88826116e2565b975061174a836116fa565b92505060018101905061172b565b5085935050505092915050565b600060808201905061177a6000830187611478565b611787602083018661166e565b6117946040830185611698565b81810360608301526117a68184611707565b905095945050505050565b6117ba81611460565b81146117c557600080fd5b50565b6000813590506117d7816117b1565b92915050565b600080604083850312156117f4576117f361137d565b5b6000611802858286016113ad565b9250506020611813858286016117c8565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082825260208201905092915050565b7f6e6f7420696d706c656d656e7465640000000000000000000000000000000000600082015250565b6000611893600f8361184c565b915061189e8261185d565b602082019050919050565b600060208201905081810360008301526118c281611886565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611903826115a1565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611936576119356118c9565b5b600182019050919050565b600060a08201905061195660008301886115ab565b61196360208301876115ab565b6119706040830186611249565b61197d6060830185611268565b61198a6080830184611268565b9695505050505050565b7f6e6f6e6578697374656e74207265717565737400000000000000000000000000600082015250565b60006119ca60138361184c565b91506119d582611994565b602082019050919050565b600060208201905081810360008301526119f9816119bd565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611a64816115a1565b82525050565b6000611a768383611a5b565b60208301905092915050565b6000602082019050919050565b6000611a9a82611a2f565b611aa48185611a3a565b9350611aaf83611a4b565b8060005b83811015611ae0578151611ac78882611a6a565b9750611ad283611a82565b925050600181019050611ab3565b5085935050505092915050565b6000604082019050611b0260008301856115ab565b8181036020830152611b148184611a8f565b90509392505050565b600081519050919050565b600081905092915050565b60005b83811015611b51578082015181840152602081019050611b36565b83811115611b60576000848401525b50505050565b6000611b7182611b1d565b611b7b8185611b28565b9350611b8b818560208601611b33565b80840191505092915050565b6000611ba38284611b66565b915081905092915050565b6000611bb9826115a1565b9150611bc4836115a1565b925082821015611bd757611bd66118c9565b5b828203905092915050565b6000611bed826115a1565b9150611bf8836115a1565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611c3157611c306118c9565b5b828202905092915050565b6000611c47826115a1565b9150611c52836115a1565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611c8757611c866118c9565b5b828201905092915050565b6000611c9d82611460565b9150611ca883611460565b925082821015611cbb57611cba6118c9565b5b828203905092915050565b60008115159050919050565b611cdb81611cc6565b82525050565b6000606082019050611cf660008301866115ab565b611d036020830185611478565b611d106040830184611cd2565b949350505050565b6000611d2382611382565b915067ffffffffffffffff821415611d3e57611d3d6118c9565b5b600182019050919050565b6000602082019050611d5e6000830184611698565b92915050565b6000611d6f82611460565b9150611d7a83611460565b9250826bffffffffffffffffffffffff03821115611d9b57611d9a6118c9565b5b828201905092915050565b6000819050919050565b6000611dcb611dc6611dc184611460565b611da6565b6115a1565b9050919050565b611ddb81611db0565b82525050565b6000604082019050611df66000830185611dd2565b611e036020830184611dd2565b9392505050565b6000604082019050611e1f6000830185611698565b611e2c6020830184611dd2565b939250505056fea2646970667358221220b237dce21f00d1cad7e3abdc14aff168717c9542b8110c7dbfbe5d43dd81fdd864736f6c63430008090033";

type VRFCoordinatorV2MockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VRFCoordinatorV2MockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VRFCoordinatorV2Mock__factory extends ContractFactory {
  constructor(...args: VRFCoordinatorV2MockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _baseFee: PromiseOrValue<BigNumberish>,
    _gasPriceLink: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<VRFCoordinatorV2Mock> {
    return super.deploy(
      _baseFee,
      _gasPriceLink,
      overrides || {}
    ) as Promise<VRFCoordinatorV2Mock>;
  }
  override getDeployTransaction(
    _baseFee: PromiseOrValue<BigNumberish>,
    _gasPriceLink: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_baseFee, _gasPriceLink, overrides || {});
  }
  override attach(address: string): VRFCoordinatorV2Mock {
    return super.attach(address) as VRFCoordinatorV2Mock;
  }
  override connect(signer: Signer): VRFCoordinatorV2Mock__factory {
    return super.connect(signer) as VRFCoordinatorV2Mock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VRFCoordinatorV2MockInterface {
    return new utils.Interface(_abi) as VRFCoordinatorV2MockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VRFCoordinatorV2Mock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as VRFCoordinatorV2Mock;
  }
}
