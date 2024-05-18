const db = require("../db");

exports.getPlayers = async (req, res) => {
  try {
    const players = await db.query("SELECT * FROM players");

    res.status(200).json({
      status: "success",
      results: players.rows.length,
      data: {
        players: players.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.createPlayer = async (req, res) => {
  const { level, experience_points, health, inventory } = req.body;
  const userId = req.auth.userId; // Assuming userId is stored in the JWT payload

  try {
    const result = await db.query(
      `INSERT INTO players (user_id, level, experience_points, health, inventory) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        userId,
        level || 1,
        experience_points || 0,
        health || 100,
        inventory || "{}",
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("/create-player", { error });
    res.status(500).send("Error creating player");
  }
};
