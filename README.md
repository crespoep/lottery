# Lottery

## Smart contract
Deploy the LotteryGame contract to Kovan:

```bash
$ cd smartcontracts
$ npm run deploy:testnet
```

Fund it with enough LINK (e.g. 1 LINK):
```bash
$ npx hardhat fund-link --contract <contract-address> --linkaddress 0xa36085F69e2889c224210F603D836748e7dC0088 --fundamount 1000000000000000000 --network kovan
```

### Register new keeper
Head over to https://keepers.chain.link/ and register a new custom logic keeper with the deployed contract address.

## Frontend
```bash
$ cp smartcontracts/deployments/kovan/LotteryGame.json frontend/src/contracts/LotteryGame.json
```

Copy the contract-address.example.json and change the name to contract-address.json, then complete the deployed contract address
```bash
$ cp frontend/src/contracts/contract-address.example.json frontend/src/contracts/contract-address.json
```
