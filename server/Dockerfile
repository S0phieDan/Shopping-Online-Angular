FROM node:15.4.0-alpine3.10

WORKDIR /code

#ENV PORT 80

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5000

CMD ["node", "server.js"]