const express = require("express");
const { updateWorldState } = require("../controllers/worldController");

const router = express.Router();

router.post("/update", updateWorldState);

module.exports = router;
