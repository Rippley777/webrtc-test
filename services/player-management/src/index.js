require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const routes = require("./routes");

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(routes);

const server = app.listen(8004, () => {
  console.log("Server running on port 8004");
});
