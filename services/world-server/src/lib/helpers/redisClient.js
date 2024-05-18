const redis = require("redis");
const logger = require("./logger");

const client = redis.createClient();

client.on("error", (err) => {
  logger.error("Redis error", { error: err });
});

client.on("connect", () => {
  logger.info("Connected to Redis");
});

module.exports = client;
