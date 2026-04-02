const request = require("supertest");
const app = require("../app");

describe("Auth", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "test_" + Date.now(),
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
  }, 10000);
});
