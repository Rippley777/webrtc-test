const axios = require("axios");
const redisClient = require("../lib/helpers/redisClient");
const db = require("../db");
const logger = require("../lib/helpers/logger");

const GAME_LOGIC_SERVICE_URL =
  process.env.GAME_LOGIC_SERVICE_URL || "http://game-logic:8003";

console.log("GAME_LOGIC_SERVICE_URL", GAME_LOGIC_SERVICE_URL);
// Function to fetch initial user location from PostgreSQL
const fetchUserLocationFromDB = async (userId) => {
  try {
    logger.info("Fetching user location from PostgreSQL", { userId });
    const result = await db.query(
      "SELECT x_coordinate, y_coordinate, z_coordinate FROM user_locations WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      logger.warn("User location not found in PostgreSQL", { userId });
      return null;
    }
    return result.rows[0];
  } catch (err) {
    logger.error("Error fetching user location from PostgreSQL", {
      error: err,
    });
    throw err;
  }
};

// Function to update user location in Redis
const updateUserLocationInRedis = (userId, location) => {
  const locationKey = `user:location:${userId}`;
  redisClient.set(
    locationKey,
    JSON.stringify(location),
    "EX",
    60 * 5,
    (err) => {
      if (err) {
        logger.error("Error setting user location in Redis", { error: err });
      } else {
        logger.info("User location updated in Redis", { userId, location });
      }
    }
  );
};

// Function to handle user entering the world
const userEntersWorld = async (req, res) => {
  const userId = req.auth.userId;
  logger.info(`/userEntersWorld req recv userId ${userId}`);

  if (!userId) {
    logger.warn("no userId was provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  try {
    // Fetch user location from PostgreSQL
    const location = await fetchUserLocationFromDB(userId);
    if (!location) {
      return res.status(404).send("User location not found");
    }

    // Update user location in Redis
    updateUserLocationInRedis(userId, location);

    // Notify Game Logic service about user entering the world
    await axios.post(`${GAME_LOGIC_SERVICE_URL}/trigger-event`, {
      eventType: "userEntersWorld",
      eventData: { userId, location },
    });

    res.status(200).json(location);
  } catch (err) {
    res.status(500).send("Error fetching user location", { err });
  }
};

const updateUserLocation = async (req, res) => {
  const userId = req.auth.userId;
  logger.info(`updateUserLocation req recv userId ${userId}`);

  if (!userId) {
    logger.warn("no userId was provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  const { location } = req.body;

  if (!location) {
    return res.status(400).send("Invalid location");
  }

  // Update user location in Redis
  updateUserLocationInRedis(userId, location);
  try {
    // Notify Game Logic service about location update
    await axios.post(`${GAME_LOGIC_SERVICE_URL}/update-state`, {
      key: `userLocation:${userId}`,
      value: location,
    });
  } catch (err) {
    logger.error("Error updating user location in Game Logic service", {
      error: err,
    });
    return res.status(500).send("Error updating location");
  }

  res.status(200).send("Location updated");
};

const getUserLocation = (req, res) => {
  const userId = req.auth.userId;
  logger.info(`/getUserLocation req recv userId ${userId}`);

  if (!userId) {
    logger.warn("no userId was provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }
  redisClient.get(`user:location:${userId}`, (err, result) => {
    if (err) {
      logger.error("Error getting user location from Redis", { error: err });
      return res.status(500).send("Error retrieving location");
    }
    if (!result) {
      return res.status(404).send("Location not found");
    }
    res.status(200).json(JSON.parse(result));
  });
};

module.exports = { userEntersWorld, updateUserLocation, getUserLocation };
