const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { expressjwt: jwtMiddleware } = require("express-jwt");
require("dotenv").config();

const db = require("./db");

const app = express();
app.use(express.json());

// Middleware to protect routes
const requireAuth = jwtMiddleware({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.send("User created successfully");
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).send("User already exists");
    } else {
      res.status(500).send("Error creating user");
    }
  }
});

app.post("/login", async (req, res) => {
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
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
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
