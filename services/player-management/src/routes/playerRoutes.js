const express = require("express");
const { getPlayers } = require("../controllers/playerController");
const router = express.Router();

router.get("/players", getPlayers);
router.post("/create-player", createPlayer);
module.exports = router;
