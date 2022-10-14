
up:
# 	mkdir client/node_modules
	docker compose up -d
# 	sudo docker cp client:client/node_modules client/node_modules

up-rebuild:
	docker volume rm lottery_node_modules
	sudo rm -rf ./client/node_modules
	mkdir ./client/node_modules
	docker-compose up -d

up-dev:
	docker-compose --env-file .env.dev up -d smartcontracts
# 	cd smartcontracts && npm run export:testnet
	docker-compose up -d client

down:
	docker-compose down

down-r:
	docker rm -f client smartcontracts
	docker image rm lottery_client
