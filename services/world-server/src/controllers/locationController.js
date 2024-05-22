const axios = require("axios");
const redisClient = require("../lib/helpers/redisClient");
const db = require("../db");
const logger = require("../lib/helpers/logger");

const GAME_LOGIC_SERVICE_URL = "http://game-logic:8003";
// process.env.GAME_LOGIC_SERVICE_URL || "http://game-logic:8003";

console.log("GAME_LOGIC_SERVICE_URL", GAME_LOGIC_SERVICE_URL);

// Function to fetch initial user location from PostgreSQL
const fetchUserLocationFromDB = async (userId) => {
  try {
    logger.info(`Fetching user location from PostgreSQL for userId ${userId}`);
    const result = await db.query(
      "SELECT x_coordinate, y_coordinate, z_coordinate FROM user_locations WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      logger.warn(`User location not found in PostgreSQL for userId ${userId}`);
      return null;
    }
    return result.rows[0];
  } catch (err) {
    logger.error(
      `Error fetching user location from PostgreSQL for userId ${userId}: ${err.message}`
    );
    throw err;
  }
};

// Function to update user location in Redis
const updateUserLocationInRedis = (userId, location) => {
  logger.info(`Updating user location in Redis for userId ${userId}`);
  const locationKey = `user:location:${userId}`;
  redisClient.set(
    locationKey,
    JSON.stringify(location),
    "EX",
    60 * 5,
    (err) => {
      if (err) {
        logger.error(
          `Error setting user location in Redis for userId ${userId}: ${err.message}`
        );
      } else {
        logger.info(`User location updated in Redis for userId ${userId}`);
      }
    }
  );
};

// Function to handle user entering the world
const notifyGameLogicService = async (userId, location) => {
  try {
    await axios.post(`${GAME_LOGIC_SERVICE_URL}/trigger-event`, {
      eventType: "userEntersWorld",
      eventData: { userId, location },
    });
    logger.info(
      `Successfully notified Game Logic service for userId ${userId}`
    );
  } catch (err) {
    logger.error(
      `Error notifying Game Logic service for userId ${userId}: ${err.message}`
    );
  }
};

const userEntersWorld = async (req, res) => {
  const userId = req.auth.userId;
  logger.info(`userEntersWorld request received for userId ${userId}`);

  if (!userId) {
    logger.warn("No userId provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  let location;
  try {
    // Fetch user location from PostgreSQL
    location = await fetchUserLocationFromDB(userId);
    if (!location) {
      return res.status(404).send("User location not found");
    }
    logger.info(
      `User location fetched for userId ${userId}: ${JSON.stringify(location)}`
    );
  } catch (err) {
    logger.error(
      `Error fetching user location from DB for userId ${userId}: ${err.message}`
    );
    return res.status(500).send("Error fetching user location");
  }

  try {
    // Update user location in Redis
    await updateUserLocationInRedis(userId, location);
  } catch (err) {
    logger.error(
      `Error updating user location in Redis for userId ${userId}: ${err.message}`
    );
  }

  // Notify Game Logic service about user entering the world asynchronously
  Promise.allSettled([notifyGameLogicService(userId, location)]).then(
    (results) => {
      results.forEach((result) => {
        if (result.status === "rejected") {
          logger.error(
            `Game Logic notification failed for userId ${userId}: ${result.reason.message}`
          );
        }
      });
    }
  );

  res.status(200).json(location);
};

const updateUserLocation = async (req, res) => {
  const userId = req.auth.userId;
  logger.info(`updateUserLocation request received for userId ${userId}`);

  if (!userId) {
    logger.warn("No userId provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  const { location } = req.body;

  if (!location) {
    return res.status(400).send("Invalid location");
  }

  // Update user location in Redis
  updateUserLocationInRedis(userId, location);

  console.log("About to update Game Logic service");

  // Notify Game Logic service about location update asynchronously
  Promise.allSettled([
    (async () => {
      try {
        await axios.post(`${GAME_LOGIC_SERVICE_URL}/update-state`, {
          key: `userLocation:${userId}`,
          value: location,
        });
        console.log("Success");
      } catch (err) {
        logger.error(
          `Error updating user location in Game Logic service for userId ${userId}: ${err.message}`
        );
      }
    })(),
  ]).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        logger.error(
          `Game Logic update failed for userId ${userId}: ${result.reason.message}`
        );
      }
    });
  });

  res.status(200).send("Location updated");
};

const getUserLocation = (req, res) => {
  const userId = req.auth.userId;
  logger.info(`getUserLocation request received for userId ${userId}`);

  if (!userId) {
    logger.warn("No userId provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  redisClient.get(`user:location:${userId}`, (err, result) => {
    if (err) {
      logger.error(
        `Error getting user location from Redis for userId ${userId}: ${err.message}`
      );
      return res.status(500).send("Error retrieving location");
    }
    if (!result) {
      return res.status(404).send("Location not found");
    }
    res.status(200).json(JSON.parse(result));
  });
};

module.exports = { userEntersWorld, updateUserLocation, getUserLocation };
