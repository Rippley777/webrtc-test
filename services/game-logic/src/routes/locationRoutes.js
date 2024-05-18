const express = require("express");
const router = express.Router();
const {
  updateUserLocation,
  getUserLocation,
} = require("../controllers/locationController");

router.post("/update-location", (req, res) => {
  const { userId, location } = req.body;
  if (!userId || !location) {
    return res.status(400).send("User ID and location are required");
  }
  updateUserLocation(userId, location);
  res.status(200).send("Location updated");
});

router.get("/get-location/:userId", (req, res) => {
  const { userId } = req.params;
  getUserLocation(userId, (err, location) => {
    if (err) {
      return res.status(500).send("Error retrieving location");
    }
    if (!location) {
      return res.status(404).send("Location not found");
    }
    res.status(200).json(location);
  });
});

module.exports = router;
