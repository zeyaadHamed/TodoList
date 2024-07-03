document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
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
          <svg class="circle ${task.completed ? "checked" : ""}" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
          </svg>
          <svg class="check ${task.completed ? "" : "hidden"}" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
          </svg>
        </div>
        <span class="task_li ${task.completed ? "checked" : ""}">${task.text}</span>
        <svg class="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M249-207 207-249l231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
        </svg>
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

    if (target.classList.contains("circle") || target.classList.contains("check")) {
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

  const iconContainer = document.getElementById("icon");

  iconContainer.addEventListener("click", () => {
    if (body.classList.contains("light-theme")) {
      // Switch to moon icon and dark theme
      console.log("Switching to dark theme...");
      iconContainer.innerHTML = `
        <svg class="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
        </svg>
      `;
      body.classList.remove("light-theme");
    } else {
      // Switch to sun icon and light theme
      console.log("Switching to light theme...");
      iconContainer.innerHTML = `
        <svg class="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
        </svg>
      `;
      body.classList.add("light-theme");
    }
  });

  renderTasks();
});
