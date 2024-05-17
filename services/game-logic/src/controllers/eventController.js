const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

function handleEvent(event) {
  eventEmitter.emit(event.type, event);
}

eventEmitter.on("player_move", (event) => {
  // Handle player move event
});

eventEmitter.on("combat", (event) => {
  // Handle combat event
});

module.exports = {
  handleEvent,
};
