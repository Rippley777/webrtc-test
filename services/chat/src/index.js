const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const redis = require("redis");

const redisClient = redis.createClient();
const sub = redisClient.duplicate();
const pub = redisClient.duplicate();

const wss = new WebSocket.Server({ port: 8002 });

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

    ws.user = decoded; // Attach user information to WebSocket

    console.log("New client connected:", decoded.username);

    ws.on("message", (message) => {
      const parsedMessage = JSON.parse(message);

      // Publish message to Redis
      pub.publish(
        "chat",
        JSON.stringify({
          ...parsedMessage,
          sender: ws.user.username,
        })
      );
    });

    ws.on("close", () => {
      console.log("Client disconnected:", ws.user.username);
    });
  });
});

// Subscribe to Redis channel
sub.subscribe("chat");
sub.on("message", (channel, message) => {
  const parsedMessage = JSON.parse(message);

  // Broadcast message to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

console.log("Server running on port 8001");
