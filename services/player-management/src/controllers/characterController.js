// const { body } = require("express-validator");
const db = require("../db");
const logger = require("../lib/helpers/logger");

// const validateCharacter = [
//     body("name").isString().isLength({ min: 1 }).withMessage("Name is required"),
//   ];

exports.getCharactersByPlayerId = async (req, res) => {
  const userId = req.auth.userId;
  logger.info(`/get-characters-by-player-id req recv userId ${userId}`);

  if (!userId) {
    logger.warn("no userId was provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  try {
    logger.secondary("awaiting [SELECT * FROM players WHERE xyz] query");
    const players = await db.query("SELECT * FROM players WHERE user_id = $1", [
      userId,
    ]);

    if (!players.rows.length === 0) {
      logger.warn("player not found");
      return res.status(404).send("Player not found");
    }

    const player = players.rows[0];

    const characters = await db.query(
      "SELECT * FROM characters WHERE player_id = $1",
      [player.id]
    );

    logger.info(
      `/get-characters-by-player-id player ${JSON.stringify(player)}`
    );

    logger.info(
      `/get-characters-by-player-id characters ${JSON.stringify(characters)}`
    );

    res.status(200).json(characters.rows);
  } catch (error) {
    logger.error(`/get-characters-by-player-id error ${error}`);
    res.status(500).send("Error getting characters");
  }
};

exports.createCharacter = async (req, res) => {
  const userId = req.auth.userId;
  logger.info(`/create-character req recv userId: ${userId}`);

  //   const errors = validationResult(req);
  if (!userId) {
    logger.warn("no userId was provided in token");
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  if (!req.body) {
    logger.warn("no character name was provided");
    return res.status(400).json({ errors: [{ msg: "Name is required" }] });
  }
  const { name } = req.body;
  //   if (!errors.isEmpty()) {
  //     logger.warn("validation failed", { errors: errors.array() });
  //     return res.status(400).json({ errors: errors.array() });
  //   }

  try {
    const players = await db.query("SELECT * FROM players WHERE user_id = $1", [
      userId,
    ]);

    if (!players.rows[0]) {
      logger.warn("player not found");
      return res.status(404).send("Player not found");
    }

    const player = players.rows[0];
    logger.secondary("awaiting [SELECT * FROM characters WHERE xyz] query");
    const existingCharacter = await db.query(
      "SELECT * FROM characters WHERE player_id = $1",
      [player.id]
    );

    if (existingCharacter.rows.length >= 3) {
      console.warn("too many characters already exists");
      return res
        .status(409)
        .send("You've reached the current max number of characters");
    }

    logger.info(`FOUND DATA (player): ${player.rows}`);
    logger.info(`FOUND DATA (character): ${existingCharacter.rows[0]}`);

    logger.secondary("awaiting [INSERT INTO characters] query");
    const result = await db.query(
      `INSERT INTO characters (player_id, name, level, experience_points, health, inventory, skills) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [player.id, name, 1, 0, 100, "{}", "{}"]
    );
    logger.info(`/player/create-character (result) ${result}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error(`/player/create-character (error) ${error}`);
    if (error === 'duplicate key value violates unique constraint "name"') {
      return res.status(409).send("Character name already exists");
    }
    res.status(500).send("Error creating character");
  }
};
