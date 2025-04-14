import db from "../db/connection.js";
import seed from "../db/seeds/seed.js";
import { testData } from "../db/test-data";
import app from "../app.js";
import request from "supertest";

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/tasks/:task_id", () => {
  test("STATUS 200: responds with a correct article object", () => {
    return request(app)
      .get("/api/tasks/1")
      .expect(200)
      .then((response) => {
        const task = response.body.task;
        expect(task).toMatchObject({
          task_id: expect.any(Number),
          title: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          due_date: expect.any(String),
        });
      });
  });
  test("STATUS 404: returns an error when passed non-existent but valid task_id", () => {
    return request(app)
      .get("/api/tasks/9999")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Not found.");
      });
  });
  test("STATUS 400: returns an error when passed invalid  task_id", () => {
    return request(app)
      .get("/api/tasks/not-valid")
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Bad request.");
      });
  });
});
