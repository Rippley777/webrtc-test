const express = require("express");
const { handlePlayerAttack } = require("../controllers/combatController");

const router = express.Router();

router.post("/attack", handlePlayerAttack);

module.exports = router;
