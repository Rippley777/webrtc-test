const gameState = require("./gameState");

function updateWorldState() {
  // Update world state (e.g., time of day, weather)
}

// Run update loop at regular intervals
setInterval(updateWorldState, 60000);

module.exports = {
  updateWorldState,
};
