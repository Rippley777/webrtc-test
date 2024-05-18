const express = require("express");
const router = express.Router();
const {
  userEntersWorld,
  updateUserLocation,
  getUserLocation,
} = require("../controllers/locationController");

router.post("/enter-world", userEntersWorld);
router.post("/update-location", updateUserLocation);
router.get("/get-location/:userId", getUserLocation);

module.exports = router;
