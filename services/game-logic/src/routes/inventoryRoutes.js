const express = require("express");
const {
  addItemToPlayer,
  removeItemFromPlayer,
} = require("../controllers/inventoryController");

const router = express.Router();

router.post("/add", addItemToPlayer);
router.post("/remove", removeItemFromPlayer);

module.exports = router;
