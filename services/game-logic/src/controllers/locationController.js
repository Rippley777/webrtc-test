const redisClient = require("../../../lib/helpers/redisClient");
const logger = require("../../../lib/helpers/logging");

const updateUserLocation = (userId, location) => {
  const locationKey = `user:location:${userId}`;
  redisClient.set(
    locationKey,
    JSON.stringify(location),
    "EX",
    60 * 5,
    (err) => {
      // Set with expiration of 5 minutes
      if (err) {
        logger.error("Error setting user location in Redis", { error: err });
      } else {
        logger.info("User location updated in Redis", { userId, location });
      }
    }
  );
};

const getUserLocation = (userId, callback) => {
  const locationKey = `user:location:${userId}`;
  redisClient.get(locationKey, (err, result) => {
    if (err) {
      logger.error("Error getting user location from Redis", { error: err });
      callback(err, null);
    } else {
      callback(null, JSON.parse(result));
    }
  });
};

module.exports = { updateUserLocation, getUserLocation };
