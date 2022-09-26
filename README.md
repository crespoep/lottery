# Lottery

## Smart contract
Deploy the LotteryGame contract to Kovan:

```bash
cd smartcontracts
npm run deploy:testnet
```

Create a new subscription, fund it with LINK and copy the subscriptionId in .env file.

Copy .env.example file to .env and complete the real values of different environment variables

### Register new keeper
Head over to https://keepers.chain.link/ and register a new custom logic keeper with the deployed contract address.

### Create lotteries and participations
Go to smartcontracts/README.md to find explanations for the different commands.

## Frontend
```bash
cp smartcontracts/deployments/kovan/LotteryGame.json frontend/src/contracts/LotteryGame.json
```

Copy the contract-address.example.json and change the name to contract-address.json, then complete the deployed contract address
```bash
cp frontend/src/contracts/contract-address.example.json frontend/src/contracts/contract-address.json
```

