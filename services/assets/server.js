// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 8078;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Serve static files from the assets directory
app.use("/models", express.static(path.join(__dirname, "models")));
app.use("/textures", express.static(path.join(__dirname, "textures")));

app.get("/", (req, res) => {
  res.send("Asset Service is running.");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
