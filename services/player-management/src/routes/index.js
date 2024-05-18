const express = require("express");
const playerRoutes = require("./playerRoutes");
const { requireAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(requireAuth);
router.use(playerRoutes);
router.use("/character", require("./characterRoutes"));

router.get("/", (_req, res) => res.send("Player management service is up"));
router.get("/health", (_req, res) =>
  res.status(200).send(process.env.JWT_SECRET ? "UP" : "DOWN")
);

module.exports = router;
