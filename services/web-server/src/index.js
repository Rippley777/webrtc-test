const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const server = app.listen(3000, () => {
  console.log("Web server is running on http://localhost:3000");
});
