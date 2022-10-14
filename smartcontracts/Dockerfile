FROM node:16.15.1-alpine3.16
WORKDIR /smartcontracts
COPY . .
RUN npm install
USER node
ENTRYPOINT ["/bin/sh", "/smartcontracts/docker/entrypoint.sh"]
