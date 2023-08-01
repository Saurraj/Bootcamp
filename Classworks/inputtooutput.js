var fs = require("fs");

// Create a readable stream
var readerStream = fs.createReadStream("file.txt");

// Create a writable stream
var writerStream = fs.createWriteStream("file2.txt");

readerStream.pipe(writerStream);

console.log("Program Ended");
