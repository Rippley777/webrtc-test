const gameState = require("./gameState");

function assignQuestToPlayer(playerId, quest) {
  const player = gameState.players.get(playerId);
  if (player) {
    player.quests.push(quest);
  }
}

function updateQuestProgress(playerId, questId, progress) {
  const player = gameState.players.get(playerId);
  if (player) {
    const quest = player.quests.find((q) => q.id === questId);
    if (quest) {
      quest.progress = progress;
    }
  }
}

module.exports = {
  assignQuestToPlayer,
  updateQuestProgress,
};
