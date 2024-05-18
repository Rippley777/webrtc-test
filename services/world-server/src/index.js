const express = require("express");
const logger = require("./lib/helpers/logger");
const cors = require("cors");

// Create Express app
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
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
app.use("/locations", locationRoutes);

// Start the server

app.listen(9000, () => {
  logger.info(`Server running on port 9000`);
});
