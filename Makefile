up:
	docker compose up -d

down:
	docker compose down

hardhat-tests:
	docker exec -t smart-contracts npx hardhat test

hardhat-clean:
	docker exec -t smart-contracts npx hardhat clean

hardhat-compile:
	docker exec -t smart-contracts npx hardhat compile


