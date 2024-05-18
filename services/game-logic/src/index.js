require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();
app.use(bodyParser.json());

// Use the main router
app.use("/api", routes);

app.listen(8003, () => console.log(`Server running on port ${8003}`));
