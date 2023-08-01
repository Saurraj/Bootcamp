// Store the tasks in an array
let tasks = [];

// Function to add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    tasks.push({ text: taskText, completed: false });
    taskInput.value = "";
    displayTasks();
  }
}

// Function to display the tasks on the page
function displayTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <span class="task-text ${task.completed ? "completed" : ""}">${
      task.text
    }</span>
            <span class="delete-btn" onclick="deleteTask(${index})">&#10006;</span>
        `;
    listItem.onclick = () => toggleComplete(index);
    taskList.appendChild(listItem);
  });
}

// Function to mark a task as completed or uncompleted
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  displayTasks();
}

// Function to delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
}

// Function to clear completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  displayTasks();
}

// Initial display of tasks
displayTasks();
