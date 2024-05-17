const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { expressjwt: jwtMiddleware } = require("express-jwt");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const db = require("./db");

const app = express();
app.use(express.json());

// Define roles and permissions
const roles = {
  admin: ["read:any", "write:any", "delete:any"],
  user: ["read:own", "write:own"],
};

// Middleware to protect routes
const requireAuth = jwtMiddleware({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

// Middleware to check roles
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.auth || !req.auth.role) {
      return res.status(403).json({ message: "No role assigned" });
    }
    if (roles[req.auth.role].includes(role)) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

// Validation middlewares
const validateRegister = [
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

const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username or Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

app.post("/register", validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role || "user"]
    );
    res.send("User created successfully");
  } catch (error) {
    console.error("/register", { error });
    if (error.code === "23505") {
      res.status(409).send("User already exists");
    } else {
      res.status(500).send("Error creating user");
    }
  }
});

app.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

app.get("/admin", requireAuth, checkRole("write:any"), (req, res) => {
  res.send("Welcome, Admin");
});

app.get("/user", requireAuth, checkRole("read:own"), (req, res) => {
  res.send(`Welcome, User ${req.auth.username}`);
});

app.get("/user-role", requireAuth, async (req, res) => {
  const { username } = req.auth;
  try {
    const result = await db.query(
      "SELECT role FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json({ role: result.rows[0].role });
  } catch (error) {
    console.error("/user-role", { error });
    res.status(500).send("Error fetching user role");
  }
});

app.get("/protected", requireAuth, (req, res) => {
  res.send(`Welcome, you are authenticated as ${req.auth.username}`);
});

app.get("/", (_req, res) => res.send("Welcome to the MERN Docker Example!"));
app.get("/health", (_req, res) =>
  res.status(200).send(process.env.JWT_SECRET ? "UP" : "DOWN")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
