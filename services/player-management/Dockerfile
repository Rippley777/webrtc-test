FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Create a directory for logs
RUN mkdir -p /usr/src/app/logs

EXPOSE 8004

CMD ["node", "src/index.js"]
