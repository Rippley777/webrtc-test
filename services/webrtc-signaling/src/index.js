const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const wss = new WebSocket.Server({ port: 8001 });

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

console.log("Server running on port 8001");
