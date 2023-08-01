// Import events module
var events = require("events");

// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

// Create an event handler as follows
var connectHandler = function connected() {
  console.log("connection succesful.");
};
var receivedEvent = function received() {
  console.log("data received succesfully.");
};

// Bind the connection event with the handler
eventEmitter.on("connection", connectHandler);

// Bind the data_received event with the anonymous function
eventEmitter.on("data_received", receivedEvent);

// Fire the connection event
eventEmitter.emit("connection");

eventEmitter.emit("data_received");

console.log("Program Ended.");
