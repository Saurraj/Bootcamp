var express = require("express");
var app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/ask", function (req, res) {
  res.render("final", {
    user: { name: "Ayush", age: "20" },
  });
});
app.listen(3000);
