// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3001;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Serve static files from the assets directory
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.send("Asset Service is running.");
});

app.listen(port, () => {
  console.log(`Asset service running at http://localhost:${port}`);
});
