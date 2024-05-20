const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
  const token = req.url.split("token=")[1];

  if (!token) {
    ws.close(1008, "Missing token");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      ws.close(1008, "Invalid token");
      return;
    }

    console.log("New client connected:", decoded);

    ws.on("message", (message) => {
      console.log("Received message:", message);
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
});

async function handleOffer(ws, offer) {
  const peer = new wrtc.RTCPeerConnection();

  await peer.setRemoteDescription(new wrtc.RTCSessionDescription(offer));

  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  ws.send(JSON.stringify({ type: 'answer', answer }));

  peer.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log('Data channel opened');
      startSendingUserLocations(dataChannel);
    };

    dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
  };
}

// Function to fetch user locations from Redis and send to data channel
function startSendingUserLocations(dataChannel) {
  setInterval(async () => {
    const userLocations = await fetchUserLocations();

    dataChannel.send(JSON.stringify({
      type: 'userLocations',
      data: userLocations,
    }));
  }, 5000); // Send updates every 5 seconds
}

// Function to fetch user locations from Redis
async function fetchUserLocations() {
  return new Promise((resolve, reject) => {
    redisClient.hgetall('userLocations', (err, userLocations) => {
      if (err) {
        return reject(err);
      }

      resolve(userLocations);
    });
  });
}

console.log("Server running on port 8080");
