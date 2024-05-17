const gameState = require("./gameState");

function addItemToPlayer(playerId, item) {
  const player = gameState.players.get(playerId);
  if (player) {
    player.inventory.push(item);
  }
}

function removeItemFromPlayer(playerId, itemId) {
  const player = gameState.players.get(playerId);
  if (player) {
    player.inventory = player.inventory.filter((item) => item.id !== itemId);
  }
}

module.exports = {
  addItemToPlayer,
  removeItemFromPlayer,
};
