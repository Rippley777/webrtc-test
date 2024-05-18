const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");
const { createCharacter } = require("../controllers/characterController");

router.post("/create-character", createCharacter);

module.exports = router;
