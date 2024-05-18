const redis = require("redis");
const logger = require("./logger");

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (err) => {
  logger.error("Redis error", { error: err });
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

module.exports = redisClient;
