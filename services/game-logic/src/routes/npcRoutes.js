const express = require("express");
const { updateNpcStates } = require("../controllers/npcController");

const router = express.Router();

router.post("/update", updateNpcStates);

module.exports = router;
