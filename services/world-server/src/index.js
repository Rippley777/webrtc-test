const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const logger = require("./lib/helpers/logger");

// Create Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create Redis client
const redisClient = redis.createClient();
redisClient.on("error", (err) => logger.error("Redis error", { error: err }));
redisClient.on("connect", () => logger.info("Connected to Redis"));

// Import routes
const locationRoutes = require("./routes/locationRoutes");
app.use("/locations", locationRoutes);

// Start the server

app.listen(9000, () => {
  logger.info(`Server running on port 9000`);
});
