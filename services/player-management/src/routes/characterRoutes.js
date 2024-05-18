const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");
const { createCharacter } = require("../controllers/characterController");

const validateCharacter = [
  body("name").isString().isLength({ min: 1 }).withMessage("Name is required"),
];

router.post(
  "/create-character",
  requireAuth,
  validateCharacter,
  createCharacter
);

module.exports = router;
