const gameState = require("./gameState");
const { authenticatePlayer } = require("./communicationController");

async function handlePlayerLogin(req, res) {
  const { token } = req.body;

  try {
    const playerData = await authenticatePlayer(token);
    gameState.addPlayer(playerData);
    res.status(200).json({ message: "Login successful", player: playerData });
  } catch (error) {
    res.status(401).json({ message: "Login failed", error: error.message });
  }
}

function handlePlayerMove(req, res) {
  const { playerId, newPosition } = req.body;

  gameState.updatePlayerState(playerId, { position: newPosition });
  res.status(200).json({ message: "Player moved", newPosition });
}

module.exports = {
  handlePlayerLogin,
  handlePlayerMove,
};
