app.post("/update-state", (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).send("Key and value are required");
  }
  gameState[key] = value;
  logger.info("Game state updated", { key, value });
  res.status(200).send("Game state updated");
});

// Endpoint to get game state
app.get("/get-state", (req, res) => {
  res.status(200).json(gameState);
});
