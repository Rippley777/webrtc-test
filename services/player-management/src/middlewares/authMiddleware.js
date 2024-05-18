const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("/player requireAuth middleware hit", { req, token });

  if (!token) {
    return res.status(401).send("No token provided");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.auth = payload;
    next();
  });
};
