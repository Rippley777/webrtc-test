// server.js
const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.send('Asset Service is running.');
});

app.listen(port, () => {
  console.log(`Asset service running at http://localhost:${port}`);
});

