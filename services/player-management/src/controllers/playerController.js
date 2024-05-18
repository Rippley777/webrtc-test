const db = require("../db");
const logger = require("../lib/helpers/logger");

exports.getPlayers = async (req, res) => {
  try {
    logger.info("awaiting [SELECT * FROM players] query");
    const players = await db.query("SELECT * FROM players");
    logger.info({ players });
    res.status(200).json({
      status: "success",
      results: players.rows.length,
      data: {
        players: players.rows,
      },
    });
  } catch (err) {
    logger.error(err.message);
  }
};

exports.getPlayer = async (req, res) => {
  const userId = req.auth.userId;

  console.log("/player/get-player", { userId });
  if (!userId) {
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  try {
    const existingPlayer = await db.query(
      "SELECT * FROM players WHERE user_id = $1",
      [userId]
    );
    console.log("/player/get-player", { existingPlayer: existingPlayer.rows });
    if (existingPlayer.rows.length === 0) {
      return res.status(404).send("Player not found");
    }

    res.status(200).json({
      status: "success",
      data: {
        player: existingPlayer.rows[0],
      },
    });
  } catch (err) {
    logger.error("getPlayer [playerController]", { err });
    res.status(500).send("Server Error");
  }
};

exports.createPlayer = async (req, res) => {
  const userId = req.auth.userId; // Assuming userId is stored in the JWT payload
  logger.info(`/create-player req recv userId: ${userId}`);

  try {
    logger.secondary("awaiting [SELECT * FROM players WHERE xyz] query");
    const existingPlayer = await db.query(
      "SELECT * FROM players WHERE user_id = $1",
      [userId]
    );
    logger.secondary(`existing player ${existingPlayer.rows}`);
    if (existingPlayer.rows.length > 0) {
      logger.warn("player already exists");
      return res.status(409).send("Player already exists");
    }

    logger.secondary("awaiting [INSERT INTO players (*)] query");
    const result = await db.query(
      `INSERT INTO players (user_id, level, experience_points, health, inventory) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, 1, 0, 100, "{}"]
    );
    logger.info(`query result result: ${result.rows}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error(`createPlayer [playerController] error: ${error}`);
    res.status(500).send("Error creating player");
  }
};
