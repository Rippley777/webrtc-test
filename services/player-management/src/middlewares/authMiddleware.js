const jwt = require("jsonwebtoken");
const logger = require("../lib/helpers/logger");

exports.requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  logger.info("/player requireAuth [middleware]", { token });

  if (!token) {
    return res.status(401).send("No token provided");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.auth = payload;
    logger.success("/player requireAuth middleware", { payload });
    next();
  });
};
