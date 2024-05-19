require("dotenv").config();
const express = require("express");
const httpProxy = require("http-proxy");
const logger = require("./lib/helpers/logger");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Configure target servers
const servers = [
  { url: "http://world-server-1:9000" },
  { url: "http://world-server-2:9000" },
];

// Middleware to choose the target server
app.use((req, res, next) => {
  const userId = req.body.userId || req.query.userId;
  if (!userId) {
    return res.status(400).send("User ID is required");
  }
  // Simple hashing to assign server
  const serverIndex = parseInt(userId, 36) % servers.length;
  req.targetServer = servers[serverIndex].url;
  next();
});

// Route requests to the appropriate world server
app.use((req, res) => {
  proxy.web(req, res, { target: req.targetServer }, (err) => {
    logger.error("Proxy error", { error: err });
    res.status(500).send("Proxy error");
  });
});

// Start the gateway server
const PORT = 8070;
app.listen(PORT, () => {
  logger.info(`Gateway server running on port ${PORT}`);
});
