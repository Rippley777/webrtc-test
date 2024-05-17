const express = require("express");
const {
  assignQuestToPlayer,
  updateQuestProgress,
} = require("../controllers/questController");

const router = express.Router();

router.post("/assign", assignQuestToPlayer);
router.post("/update", updateQuestProgress);

module.exports = router;
