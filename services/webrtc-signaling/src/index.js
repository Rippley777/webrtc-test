const WebSocket = require("ws");
const { RTCPeerConnection, RTCSessionDescription } = require("wrtc");
const server = require("http").createServer();

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "offer":
        // Handle WebRTC offer
        break;
      case "answer":
        // Handle WebRTC answer
        break;
      case "candidate":
        // Handle new ICE candidate
        break;
      default:
        console.log("Unknown message type:", msg.type);
    }
  });

  ws.send(JSON.stringify({ message: "Connected to WebRTC signaling server" }));
});

server.listen(8080, () => {
  console.log("WebRTC signaling server running on http://localhost:8080");
});
