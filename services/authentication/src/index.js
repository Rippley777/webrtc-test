require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use(routes);

app.get("/health", (_req, res) =>
  res.status(200).send(process.env.JWT_SECRET ? "UP" : "DOWN")
);

app.get("/", (_req, res) => res.send("Welcome to the MERN Docker Example!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
