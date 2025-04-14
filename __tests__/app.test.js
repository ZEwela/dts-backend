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
describe("GET /api/tasks", () => {
  test("STATUS 200: returns an array of tasks objects with correct properties", () => {
    return request(app)
      .get("/api/tasks")
      .expect(200)
      .then((response) => {
        const tasks = response.body.tasks;

        expect(tasks.length).toBe(5);
        tasks.forEach((task) => {
          expect(task).toMatchObject({
            task_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            status: expect.any(String),
            due_date: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/tasks/:task_id", () => {
  test("STATUS 200: responds with a correct task object", () => {
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

describe("POST /api/tasks", () => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 5);
  const formattedFutureDate = futureDate.toISOString();

  test("STATUS 201: responds with a new task object", () => {
    const body = {
      title: "New Task",
      description: "New Description",
      status: "Pending",
      due_date: formattedFutureDate,
    };

    return request(app)
      .post("/api/tasks")
      .send(body)
      .expect(201)
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
  test("STATUS 201: returns a new task with status property set by default if not provided in the request body", () => {
    const body = {
      title: "New Task",
      description: "New Description",
      due_date: formattedFutureDate,
    };

    return request(app)
      .post("/api/tasks")
      .send(body)
      .expect(201)
      .then((response) => {
        const task = response.body.task;
        expect(task).toHaveProperty("status");
      });
  });
  test("STATUS 201: returns a new task and ignores unnecessary properties", () => {
    const body = {
      title: "New Task",
      description: "New Description",
      status: "Pending",
      due_date: formattedFutureDate,
      toIgnore: "ignore me pls",
    };

    return request(app)
      .post("/api/tasks")
      .send(body)
      .expect(201)
      .then((response) => {
        const task = response.body.task;
        expect(task).not.toHaveProperty("toIgnore");
      });
  });
  test("STATUS 400: returns an error when the request body does not contain all the required values", () => {
    const body = {
      description: "New Description",
      status: "Pending",
      due_date: formattedFutureDate,
    };

    return request(app)
      .post("/api/tasks")
      .send(body)
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Bad request. Missing required fields.");
      });
  });
  test("STATUS 400: returns error for invalid due_date", () => {
    const body = {
      title: "Task with bad date",
      description: "Oops",
      due_date: "not-a-real-date",
    };

    return request(app)
      .post("/api/tasks")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid timestamp format.");
      });
  });

  test("400: invalid status value ", async () => {
    const body = {
      title: "Wrong status",
      description: "This task has a status not in the list",
      status: "DefinitelyNotAStatus",
      due_date: formattedFutureDate,
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(body)
      .expect(400);

    expect(response.body.msg).toBe("Invalid status value.");
  });
});
