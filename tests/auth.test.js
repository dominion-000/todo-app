const request = require("supertest");
const app = require("../app");

// register test
describe("Auth", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "test_" + Date.now(),
        password: "123456"
      });

    expect(res.header.location).toBe("/login");
  });
});

// login test
it("should login user", async () => {
  await request(app).post("/auth/register").send({
    username: "testuser2",
    password: "password123"
  });

  const res = await request(app).post("/auth/login").send({
    username: "testuser2",
    password: "password123"
  });

  expect(res.header.location).toBe("/");
});
