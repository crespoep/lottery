# Lottery

---
## Necessary steps to make it work:
### VRF Subscription
Create a new subscription or use already created one, fund it with LINK and copy the subscriptionId in .env file.
### Register new keeper
After deploying, head over to https://keepers.chain.link/ and register a new custom logic keeper with the deployed contract address.

## Project
Copy the env file and complete the variables
```bash
cp smart-contracts/.env.example smart-contracts/.env
```

Deploy the contract to local network:
```bash
docker exec smart-contracts npm run deploy:local
```
or both deploy and run the node:
```bash
docker exec smart-contracts npm run hardhat:local
```

Also you can deploy to testnet with:
```bash
docker exec smart-contracts npm run deploy:testnet
```

Export the deployed contract data and copy to the client container
```bash
docker exec smart-contracts npx hardhat export --export ./contracts.json --network <network>
docker cp smart-contracts/contracts.json client:/client/src
```

Run de client
```bash
docker exec client npm start
```
