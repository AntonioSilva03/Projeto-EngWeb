FROM node:22.1.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7777

CMD ["npm", "start"]