FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Install any specific tools or libraries needed for game logic
RUN npm install
COPY . .
EXPOSE 8003
CMD ["node", "index.js"]
