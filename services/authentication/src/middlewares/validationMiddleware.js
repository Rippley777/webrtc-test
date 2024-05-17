const { body } = require("express-validator");

exports.validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .notEmpty()
    .withMessage("Username is required"),
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
];

exports.validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username or Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
