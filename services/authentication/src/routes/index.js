const express = require("express");
const authRoutes = require("./authRoutes");

const router = express.Router();

// Use authRoutes directly
router.use(authRoutes);

router.get("/", (_req, res) => res.send("Welcome to the MERN Docker Example!"));
router.get("/health", (_req, res) =>
  res.status(200).send(process.env.JWT_SECRET ? "UP" : "DOWN")
);

module.exports = router;
