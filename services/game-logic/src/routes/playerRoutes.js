const express = require("express");
const {
  handlePlayerLogin,
  handlePlayerMove,
} = require("../controllers/playerController");
const { validatePlayerAction } = require("../controllers/securityController");

const router = express.Router();

router.post("/login", handlePlayerLogin);
router.post("/move", validatePlayerAction, handlePlayerMove);

module.exports = router;
