cd /smartcontracts

ARG CONTRACT_ADDRESS

echo ${CONTRACT_ADDRESS}

npx hardhat clean
npx hardhat compile

#npx hardhat export --export ../client/src/contracts.json --network mumbai

npm run hardhat:local
