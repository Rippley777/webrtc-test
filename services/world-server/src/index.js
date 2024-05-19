require("dotenv").config();
const express = require("express");
const logger = require("./lib/helpers/logger");
const cors = require("cors");

// Create Express app
const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
};

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Import routes
const locationRoutes = require("./routes/locationRoutes");
app.use(locationRoutes);
app.get("/", (_req, res) => res.send("Player management service is up"));
app.get("/health", (_req, res) =>
  res.status(200).send(process.env.JWT_SECRET ? "UP" : "DOWN")
);
// Start the server

app.listen(9000, () => {
  logger.info(`Server running on port 9000`);
});
