const express = require("express");
const { handleEvent } = require("../controllers/eventController");

const router = express.Router();

router.post("/handle", handleEvent);
router.post("/trigger-event", (req, res) => {
  console.log('trigger-event called');
  const { eventType, eventData } = req.body;
  if (!eventType || !eventData) {
    return res.status(400).send("Event type and data are required");
  }
  logger.info("Event triggered", { eventType, eventData });
  // Process event (logic to be implemented)
  res.status(200).send("Event processed");
});

module.exports = router;
