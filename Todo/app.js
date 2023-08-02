const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const pool = require("./db");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

function requireLogin(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}

app.use("/auth", authRoutes);
app.use("/todo", requireLogin, todoRoutes);

app.get("/", (req, res) => {
  res.redirect("/auth/signup");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
