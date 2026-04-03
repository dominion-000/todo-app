const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");

let currentFilter = "";

async function loadTasks() {
  let url = "/tasks";

  if (currentFilter) {
    url += `?status=${currentFilter}`;
  }

  const res = await fetch(url);
  const tasks = await res.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.status === "completed" ? "done" : ""}">
        ${task.title}
      </span>

      <div>
        ${
          task.status !== "completed"
            ? `<button onclick="updateTask('${task._id}', 'completed')">✔</button>`
            : ""
        }
        <button onclick="updateTask('${task._id}', 'deleted')">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = form.title.value;

  await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  });

  form.reset();
  loadTasks();
});

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  loadTasks();
}

async function updateTask(id, status) {
  await fetch(`/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  loadTasks();
}

loadTasks();
