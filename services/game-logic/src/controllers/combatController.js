const gameState = require("./gameState");

function handlePlayerAttack(attackerId, targetId) {
  const attacker = gameState.players.get(attackerId);
  const target =
    gameState.players.get(targetId) || gameState.npcs.get(targetId);

  if (attacker && target) {
    // Calculate damage
    const damage = calculateDamage(attacker, target);
    target.health -= damage;

    // Broadcast combat event
  }
}

function calculateDamage(attacker, target) {
  // Simple damage calculation
  return Math.max(0, attacker.attack - target.defense);
}

module.exports = {
  handlePlayerAttack,
};
