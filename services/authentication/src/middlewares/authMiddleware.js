const { expressjwt: jwtMiddleware } = require("express-jwt");

const roles = {
  admin: ["read:any", "write:any", "delete:any"],
  user: ["read:own", "write:own"],
};

// Middleware to protect routes
const requireAuth = jwtMiddleware({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth", // Property on req object where the payload is attached
});

// Middleware to check roles
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.auth.role;

    if (!userRole) {
      return res.status(403).json({ message: "No role assigned" });
    }

    if (roles[userRole] && roles[userRole].includes(requiredRole)) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

// Middleware to handle errors from JWT validation
const handleAuthErrors = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  next(err);
};

module.exports = {
  requireAuth,
  checkRole,
  handleAuthErrors,
};
