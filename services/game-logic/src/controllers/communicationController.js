// communicationController.js
const axios = require("axios");

async function sendMessageToChatService(message) {
  await axios.post("http://chat:8002/message", message);
}

async function authenticatePlayer(token) {
  const response = await axios.post("http://auth:8001/verify", { token });
  return response.data;
}

module.exports = {
  sendMessageToChatService,
  authenticatePlayer,
};
