// securityController.js
const { body, validationResult } = require("express-validator");

const validatePlayerAction = [
  body("action").isString().withMessage("Action must be a string"),
  body("playerId").isUUID().withMessage("Player ID must be a valid UUID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validatePlayerAction,
};
