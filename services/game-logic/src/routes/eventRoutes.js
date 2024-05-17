const express = require("express");
const { handleEvent } = require("../controllers/eventController");

const router = express.Router();

router.post("/handle", handleEvent);

module.exports = router;
