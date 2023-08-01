const express = require("express");
const app = express();

app.set("view engine", "ejs");

const todos = [
  {
    todoId: "1",
    todoTask: "Code",
  },
  {
    todoId: "2",
    todoTask: "Sleep",
  },
  {
    todoId: "3",
    todoTask: "Coffee",
  },
];

// Keep track of the highest todoId value
let todoIdCounter = todos.length;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    data: todos,
  });
});

app.get("/view", (req, res) => {
  res.render("index", {
    data: todos,
  });
});

app.post("/view", (req, res) => {
  const inputTodoTask = req.body.todoTask;

  // Increment the todoIdCounter to get a unique todoId
  todoIdCounter++;
  const newTodo = {
    todoId: todoIdCounter.toString(),
    todoTask: inputTodoTask,
  };

  todos.push(newTodo);

  res.redirect("/view");
});

app.post("/delete", (req, res) => {
  const requestedTodoId = req.body.todoId;
  const index = todos.findIndex((todo) => todo.todoId === requestedTodoId);

  if (index !== -1) {
    todos.splice(index, 1);
  }

  res.redirect("/view");
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
