// gameState.js
class GameState {
  constructor() {
    this.players = new Map();
    this.npcs = new Map();
    this.items = new Map();
  }

  addPlayer(player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  updatePlayerState(playerId, newState) {
    const player = this.players.get(playerId);
    if (player) {
      Object.assign(player, newState);
    }
  }

  // Additional methods for NPCs, items, etc.
}

module.exports = new GameState();
