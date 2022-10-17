FROM node:16.15.1-alpine3.16
WORKDIR /smart-contracts
COPY . .
RUN npm install
USER node
ENTRYPOINT ["/bin/sh", "/smart-contracts/docker/entrypoint.sh"]
