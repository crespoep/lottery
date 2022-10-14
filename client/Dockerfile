FROM node:16.15.1-alpine3.16

WORKDIR /client

COPY . .
COPY package.json .
RUN npm install

CMD ["npm", "start"]
