require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes");

const app = express();
app.use(bodyParser.json());

// Use the main router
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
