FROM node:22.1.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install mongoose

COPY . .

EXPOSE 7776

CMD ["npm", "start"]
