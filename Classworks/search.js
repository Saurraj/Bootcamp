const fs = require("fs");
const FILE_LOCATION = "file.txt";
const EventEmitter = require("events");
var eventEmitter = new EventEmitter();
eventEmitter.on("myEvent", (msg) => {
  console.log(msg);
});

fs.readFile(FILE_LOCATION, function (err, data) {
  if (err) throw err;
  eventEmitter.emit("myEvent", "Connection established");
  const lines = data.toString().split("\n");
  const foundLine = lines.find((line) => line.includes("millionaire"));
  console.log(foundLine);
  eventEmitter.emit("myEvent", "foundLine");
});
