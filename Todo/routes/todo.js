const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;

    const todoItems = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1",
      [userId]
    );
    const userQueryResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    const user = userQueryResult.rows[0];

    res.render("todo", { user: user, todoItems: todoItems.rows, error: null });
  } catch (err) {
    console.error("Error fetching todo items:", err);
    res.render("todo", {
      error: "An error occurred while fetching todo items",
      user: null,
      todoItems: [],
    });
  }
});

router.post("/add", async (req, res) => {
  const { todoText } = req.body;
  const userId = req.session.userId;

  try {
    await pool.query("INSERT INTO todos (user_id, text) VALUES ($1, $2)", [
      userId,
      todoText,
    ]);

    res.redirect("/todo");
  } catch (err) {
    console.error("Error adding todo item:", err);
    res.render("todo", {
      error: "An error occurred while adding the todo item",
    });
  }
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { todoText } = req.body;
  const userId = req.session.userId;

  try {
    await pool.query(
      "UPDATE todos SET text = $1 WHERE id = $2 AND user_id = $3",
      [todoText, id, userId]
    );

    res.redirect("/todo");
  } catch (err) {
    console.error("Error updating todo item:", err);
    res.render("todo", {
      error: "An error occurred while updating the todo item",
    });
  }
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);

    res.redirect("/todo");
  } catch (err) {
    console.error("Error deleting todo item:", err);
    res.render("todo", {
      error: "An error occurred while deleting the todo item",
    });
  }
});

router.post("/complete/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const isCompleted = req.body.isCompleted === "true"; // Convert string to boolean

  try {
    if (isCompleted) {
      await pool.query(
        "UPDATE todos SET is_completed = false WHERE id = $1 AND user_id = $2",
        [id, userId]
      );
    } else {
      await pool.query(
        "UPDATE todos SET is_completed = true WHERE id = $1 AND user_id = $2",
        [id, userId]
      );
    }
    res.redirect("/todo");
  } catch (err) {
    console.error("Error marking/unmarking todo item:", err);
    res.render("todo", {
      error: "An error occurred while updating the todo item",
    });
  }
});

module.exports = router;
