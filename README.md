# Lottery

## Docker
###
Copy the env file for hardhat and complete the variables
```bash
cp smartcontracts/.env.example smartcontracts/.env
```

### Compile the contracts
```bash
npx hardhat compile
```

## Frontend

Copy the contract artifact
```bash
npx hardhat export --export ../client/src/contracts.json --network mumbai
```


## Smart contract
Deploy the LotteryGame contract to testnet:

```bash
cd smartcontracts
npm run deploy:testnet
```

Copy .env.example file to .env and complete the real values of different environment variables

Create a new subscription, fund it with LINK and copy the subscriptionId in .env file.

### Register new keeper
Head over to https://keepers.chain.link/ and register a new custom logic keeper with the deployed contract address.



### Create lotteries and participations
Go to smartcontracts/README.md to find explanations for the different commands.



Copy the contract-address.example.json and change the name to contract-address.json, then complete the deployed contract address
```bash

```

