const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");

async function loadTasks() {
  const res = await fetch("/tasks");
  const tasks = await res.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.status === "completed" ? "done" : ""}">
        ${task.title}
      </span>

      <div>
        <button onclick="updateTask('${task._id}', 'completed')">✔</button>
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
