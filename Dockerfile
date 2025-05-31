# Use uma imagem do Node 20 (em vez do 18)
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
