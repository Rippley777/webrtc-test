const express = require("express");
const app = express();

const routes = require("./routes");

app.use(routes);

const server = app.listen(8004, () => {
  console.log("Server running on port 8004");
});
