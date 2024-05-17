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
