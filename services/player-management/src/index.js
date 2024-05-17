const express = require("express");
const app = express();

const db = require("./db");

// Ensuring the table exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT,
    x INTEGER,
    y INTEGER
);`;

db.query(createTableQuery)
  .then((res) => console.log("Table created successfully"))
  .catch((err) => console.error("Error executing query", err.stack));

app.get("/players", (req, res) => {
  db.query("SELECT * FROM players", (err, result) => {
    if (err) {
      return res.status(400).json(err);
    }
    res.json(result.rows);
  });
});

app.get("/", (_req, res) => res.send("Welcome to player management!"));

app.get("/health", (_req, res) => res.status(200).send(db ? "UP" : "DOWN"));

const server = app.listen(8004, () => {
  console.log("Player management server running on http://localhost:8004");
});
