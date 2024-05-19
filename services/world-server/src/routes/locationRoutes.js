const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");

const {
  userEntersWorld,
  updateUserLocation,
  getUserLocation,
} = require("../controllers/locationController");

router.post("/enter-world", requireAuth, userEntersWorld);
router.post("/update-location", requireAuth, updateUserLocation);
router.get("/get-location", requireAuth, getUserLocation);

module.exports = router;
