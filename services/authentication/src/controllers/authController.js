const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log("/register", { username, email, password });
  const hashedPassword = await bcrypt.hash(password, 10);

  // validation is turning empty string into '@'
  // please investigate ./middlewares/validationMiddleware.js
  if (email === "@") {
    return res.status(400).send("Invalid email");
  }

  if (!username || !email || !hashedPassword) {
    return res.status(400).send("Invalid input");
  }

  try {
    const result = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, role || "user"]
    );
    res.send("User created successfully");
  } catch (error) {
    console.error("/register (error) ", { error });
    if (error.code === "23505") {
      if (error.constraint === "users_email_key") {
        return res.status(409).send("Email already exists");
      }
      if (error.constraint === "users_username_key") {
        return res.status(409).send("Username already exists");
      }
    } else {
      res.status(500).send("Error creating user");
    }
  }
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("/login", { username, email, password });
  try {
    if (!username && !email) {
      return res.status(400).send("Username or Email is required");
    }
    let result;
    if (username) {
      result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
    } else if (email) {
      result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    }

    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result.rows[0];
    console.log("/login (db results)", { result: result.rows, user });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ id, token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};

exports.requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
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

exports.getAdmin = (req, res) => {
  res.send("Welcome, Admin");
};

exports.getUser = (req, res) => {
  res.send(`Welcome, User ${req.auth.username}`);
};

exports.getUserRole = async (req, res) => {
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
};

exports.getProtected = (req, res) => {
  res.send(`Welcome, you are authenticated as ${req.auth.username}`);
};
