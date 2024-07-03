document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const containerTodo = document.querySelector(".container-todo");
  const sunIcon = document.querySelector(".sun");
  const inputTask = document.querySelector(".input_task");
  const tasksList = document.querySelector(".tasks");
  const countElement = document.getElementById("count");
  const settingLinks = document.querySelectorAll(".setting_ul li");
  const clearCompletedButton = document.querySelector(".clear span");
  const circleWrapper = document.querySelector(".input_fild .circle-wrapper");
  const checkIcon = document.querySelector(".input_fild .check");
  const circle = document.querySelector(".input_fild .circle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks(filter = "All") {
    tasksList.innerHTML = "";

    const filteredTasks = tasks.filter((task) => {
      if (filter === "All") return true;
      if (filter === "Active") return !task.completed;
      if (filter === "Completed") return task.completed;
    });

    filteredTasks.forEach((task, index) => {
      const taskElement = document.createElement("li");
      taskElement.className = `task ${task.completed ? "checked" : ""}`;
      taskElement.dataset.index = index;

      taskElement.innerHTML = `
        <div class="circle-wrapper">
          <svg class="circle ${
            task.completed ? "checked" : ""
          }" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
          <svg class="check ${
            task.completed ? "" : "hidden"
          }" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </div>
        <span class="task_li ${task.completed ? "checked" : ""}">${
        task.text
      }</span>
        <svg class="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M249-207 207-249l231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
      `;

      tasksList.appendChild(taskElement);
    });

    updateTasksCount(filter);
  }

  function updateTasksCount(filter = "All") {
    let count;
    if (filter === "All") {
      count = tasks.length;
    } else if (filter === "Active") {
      count = tasks.filter((task) => !task.completed).length;
    } else if (filter === "Completed") {
      count = tasks.filter((task) => task.completed).length;
    }
    countElement.textContent = count;
  }

  function toggleTaskCompletion(index) {
    const currentFilter = getActiveFilter();
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks(currentFilter);
    updateTasksCount(currentFilter);
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getActiveFilter());
    updateTasksCount(getActiveFilter());
  }

  function addTask(taskText, isChecked) {
    tasks.push({ text: taskText, completed: isChecked });
    saveTasks();
    renderTasks(getActiveFilter());
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function getActiveFilter() {
    const activeLink = Array.from(settingLinks).find((link) =>
      link.classList.contains("active")
    );
    return activeLink ? activeLink.textContent : "All";
  }

  inputTask.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && inputTask.value.trim() !== "") {
      addTask(inputTask.value.trim(), false); // Ensure new tasks are not initially completed
      inputTask.value = "";
      circle.classList.remove("checked");
      checkIcon.classList.add("hidden");
    }
  });

  tasksList.addEventListener("click", (event) => {
    const target = event.target;
    const taskElement = target.closest(".task");
    if (!taskElement) return; // Exit early if not clicking on a task element
    const index = taskElement.dataset.index;

    if (
      target.classList.contains("circle") ||
      target.classList.contains("check")
    ) {
      toggleTaskCompletion(index);
    } else if (target.classList.contains("close")) {
      deleteTask(index);
    }
  });

  settingLinks.forEach((link) => {
    link.addEventListener("click", () => {
      settingLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      renderTasks(link.textContent);
    });
  });

  clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks(getActiveFilter());
    updateTasksCount(getActiveFilter());
  });

  circleWrapper.addEventListener("click", () => {
    // Implement your logic here for handling circleWrapper click if needed
  });

  sunIcon.addEventListener("click", () => {
    body.classList.toggle("light-theme");
  });

  renderTasks();
});
