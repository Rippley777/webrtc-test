const gameState = require("./gameState");

function updateNpcStates() {
  gameState.npcs.forEach((npc) => {
    // Update NPC behavior and state
  });
}

// Run update loop at regular intervals
setInterval(updateNpcStates, 1000);
