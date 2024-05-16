const express = require("express");
const { Pool } = require("pg");

const app = express();

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: "test",
  host: "localhost",
  database: "mmorpg",
  password: "uthinkursneaky?",
  port: 5432,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database.");
});

// Ensuring the table exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT,
    x INTEGER,
    y INTEGER
);`;

pool
  .query(createTableQuery)
  .then((res) => console.log("Table created successfully"))
  .catch((err) => console.error("Error executing query", err.stack));

app.get("/players", (req, res) => {
  pool.query("SELECT * FROM players", (err, result) => {
    if (err) {
      return res.status(400).json(err);
    }
    res.json(result.rows);
  });
});

app.get("/", (_req, res) => res.send("Welcome to player management!"));

app.get("/health", (_req, res) => res.status(200).send(pool ? "UP" : "DOWN"));

const server = app.listen(8004, () => {
  console.log("Player management server running on http://localhost:8004");
});
