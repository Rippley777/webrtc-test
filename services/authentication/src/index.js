const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { expressjwt: jwtMiddleware } = require("express-jwt");
require("dotenv").config();

const app = express();
app.use(express.json()); // for parsing application/json

const users = {}; // This should be replaced with a real database in production

// Middleware to protect routes
const requireAuth = jwtMiddleware({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(409).send("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { password: hashedPassword };
  res.send("User created successfully");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.json({ token });
});

app.get("/protected", requireAuth, (req, res) => {
  res.send(`Welcome, you are authenticated as ${req.auth.username}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
