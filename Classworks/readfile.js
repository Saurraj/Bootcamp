var fs = require("fs");
var file = "file.txt";
// this is used to fetch data from file 2
//var data = fs.readFileSync("file2.txt");
var data = "\nthis is friday \n happy weekend";

fs.appendFileSync(file, data.toString(), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("The file was written successfully!");
  }
});

var contents = fs.readFileSync(file);

console.log(contents.toString());
