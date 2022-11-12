FROM node:16.17.0-alpine

RUN apt-get update
RUN apt-get install --yes curl

WORKDIR /home/node/app

COPY package.json .

RUN npm cache clear
RUN npm install

COPY . .
EXPOSE 5005

CMD ["npm", "run", "start:prod"]
