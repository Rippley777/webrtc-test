const { validationResult } = require("express-validator");
const db = require("../db");

// const validateCharacter = [
//     body("name").isString().isLength({ min: 1 }).withMessage("Name is required"),
//   ];

exports.createCharacter = async (req, res) => {
  console.log("/create-character", { body: req.body });
  const userId = req.auth.userId;

  //   const errors = validationResult(req);
  if (!userId) {
    return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
  }

  if (!req.body.name) {
    return res.status(400).json({ errors: [{ msg: "Name is required" }] });
  }
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

    const existingCharacter = await db.query(
      "SELECT * FROM characters WHERE player_id = $1",
      [player.playerId]
    );

    if (existingCharacter.rows.length > 0) {
      console.log("character already exists");
      return res
        .status(409)
        .send("You've reached the current max number of characters");
    }

    console.log("/player/create-character", { player });

    const result = await db.query(
      `INSERT INTO characters (player_id, name, level, experience_points, health, inventory, skills) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [player.playerId, name, 1, 0, 100, "{}", "{}"]
    );
    console.log("/player/create-character (result)", { result });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("/create-character", { error });
    res.status(500).send("Error creating character");
  }
};
