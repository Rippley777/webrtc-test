const express = require("express");

const {
  createPlayer,
  getPlayer,
  getPlayers,
} = require("../controllers/playerController");

const router = express.Router();

router.get("/players", getPlayers);
router.get("/get-player", getPlayer);
router.post("/create-player", createPlayer);

module.exports = router;
