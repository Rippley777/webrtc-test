const { validationResult } = require("express-validator");
const db = require("../db");

exports.createCharacter = async (req, res) => {
  const userId = req.auth.userId; // Assuming userId is stored in the JWT payload

  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    const { name } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const player = await db.query("SELECT * FROM players WHERE userId = $1", [
        userId,
      ]);
      if (!player) {
        return res.status(404).send("Player not found");
      }
      console.log("/create-player", { player });
      const result = await db.query(
        `INSERT INTO characters (player_id, name, level, experience_points, health, inventory) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [player.playerId, name, 1, 0, 100, "{}"]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("/create-character", { error });
      res.status(500).send("Error creating character");
    }
  };
};
