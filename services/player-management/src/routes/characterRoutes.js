const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");

const {
  createCharacter,
  getCharactersByPlayerId,
} = require("../controllers/characterController");

router.post("/create-character", requireAuth, createCharacter);
router.get("/get-characters", requireAuth, getCharactersByPlayerId);

module.exports = router;
