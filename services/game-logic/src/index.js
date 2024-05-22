require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  logger.info("world server service is up");
  res.send("world server service is up");
});
app.get("/health", (_req, res) =>
  res.status(200).send(process.env.JWT_SECRET ? "UP" : "DOWN")
);

// Use the main router
app.use("/", routes);

app.listen(8003, () => console.log(`Server running on port ${8003}`));
