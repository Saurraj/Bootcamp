const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "1234",
  port: 5432,
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("/signup");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).send("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password.");
    }

    //res.send(`Hello, ${username}! You are now logged in.`);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Something went wrong during login.");
  }
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).send("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    // res.send(`Hello, ${username}! You are now registered.`);
    res.redirect("/signup/success");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Something went wrong during signup.");
  }
});
app.get("/signup/success", (req, res) => {
  res.sendFile(__dirname + "/views/signup-success.html");
});
app.get("/dashboard", async (req, res) => {
  try {
    const queryResult = await pool.query("SELECT * FROM employee");
    const employees = queryResult.rows;

    res.render("dashboard", { employees });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).send("Error fetching employee data");
  }
});

app.get("/dashboard/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;

    const queryResult = await pool.query(
      "SELECT * FROM employee WHERE id = $1",
      [id]
    );
    const employee = queryResult.rows[0];

    res.render("edit", { employee });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).send("Error fetching employee data");
  }
});

app.post("/dashboard/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { newid, name, department } = req.body;
    const existingEmployeeWithID = await pool.query(
      "SELECT * FROM employee WHERE id = $1",
      [newid]
    );

    if (existingEmployeeWithID.rows.length > 0 && newid != id) {
      return res
        .status(409)
        .send("An employee with the same ID already exists.");
    }

    await pool.query(
      "UPDATE employee SET id = $4 ,name = $1, department = $2 WHERE id = $3",
      [name, department, id, newid]
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating employee data:", error);
    res.status(500).send("Error updating employee data");
  }
});

app.get("/dashboard/:id/delete", async (req, res) => {
  try {
    const employeeId = req.params.id;

    await pool.query("DELETE FROM employee WHERE id = $1", [employeeId]);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).send("Error deleting employee");
  }
});

app.post("/dashboard/add", async (req, res) => {
  try {
    const { id, name, department } = req.body;

    const existingEmployeeWithID = await pool.query(
      "SELECT * FROM employee WHERE id = $1",
      [id]
    );

    if (existingEmployeeWithID.rows.length > 0) {
      return res
        .status(409)
        .send("An employee with the same ID already exists.");
    }

    await pool.query(
      "INSERT INTO employee (id, name, department) VALUES ($1, $2, $3)",
      [id, name, department]
    );
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error adding new employee:", error);
    res.status(500).send("Error adding new employee");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
