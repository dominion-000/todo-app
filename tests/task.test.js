const request = require("supertest");
const app = require("../app");

let agent = request.agent(app);

// register and login
beforeAll(async () => {
  await agent.post("/auth/register").send({
    username: "taskuser",
    password: "123456"
  });

  await agent.post("/auth/login").send({
    username: "taskuser",
    password: "123456"
  });
});

// task creation test
it("should create a task", async () => {
  const res = await agent.post("/tasks").send({
    title: "Test Task"
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe("Test Task");
});

// get tasks test
it("should get tasks", async () => {
  const res = await agent.get("/tasks");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

// update task test
it("should update task status", async () => {
  const createRes = await agent.post("/tasks").send({
    title: "Another Task"
  });

  const taskId = createRes.body._id;

  const updateRes = await agent.put(`/tasks/${taskId}`).send({
    status: "completed"
  });

  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body.status).toBe("completed");
});

// filter task test
it("should filter completed tasks", async () => {
  const res = await agent.get("/tasks?status=completed");

  expect(res.statusCode).toBe(200);
  res.body.forEach(task => {
    expect(task.status).toBe("completed");
  });
});
