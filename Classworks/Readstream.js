var fs = require("fs");
var data1 = "";

// Create a readable stream
var readerStream = fs.createReadStream("file.txt");

// Set the encoding to be utf8.
readerStream.setEncoding("UTF8");

// Handle stream events --> data, end, and error
readerStream.on("data", function (chunk) {
  data1 += chunk;
});

readerStream.on("end", function () {
  console.log(data1);
});

readerStream.on("error", function (err) {
  console.log(err.stack);
});

console.log("Program Ended");
