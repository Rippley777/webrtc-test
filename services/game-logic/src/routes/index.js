const express = require("express");
const playerRoutes = require("./playerRoutes");
const npcRoutes = require("./npcRoutes");
const combatRoutes = require("./combatRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const questRoutes = require("./questRoutes");
const worldRoutes = require("./worldRoutes");
const eventRoutes = require("./eventRoutes");

const router = express.Router();

router.use("/player", playerRoutes);
router.use("/npc", npcRoutes);
router.use("/combat", combatRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/quest", questRoutes);
router.use("/world", worldRoutes);
router.use("/event", eventRoutes);

module.exports = router;
