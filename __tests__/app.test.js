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
  test("STATUS 200: returns an array of tasks from 'page' specified by page query", () => {
    return request(app)
      .get("/api/tasks?page=2")
      .expect(200)
      .then((response) => {
        const tasks = response.body.tasks;

        expect(tasks[0].task_id).toBe(11);
      });
  });
  test("STATUS 200: returns an empty array if the provided 'page' query value refers to page that is bigger than accessible pages", () => {
    return request(app)
      .get("/api/tasks?page=4")
      .expect(200)
      .then((response) => {
        const tasks = response.body.tasks;
        expect(tasks.length).toBe(0);
      });
  });
  test("STATUS 200: returns an array of tasks objects filtered by status query", () => {
    const status = "Pending";
    return request(app)
      .get(`/api/tasks?status=${status}`)
      .expect(200)
      .then((response) => {
        const tasks = response.body.tasks;
        tasks.forEach((task) => {
          expect(task.status).toBe(status);
        });
      });
  });
  test("STATUS 200: returns an empty array if there are not any tasks with provided status query", () => {
    const status = "Completed";
    return request(app)
      .get(`/api/tasks?status=${status}`)
      .expect(200)
      .then((response) => {
        const tasks = response.body.tasks;
        expect(tasks.length).toBe(0);
      });
  });
  test("STATUS 400: returns an error if provided status is not valid", () => {
    const status = "not-valid";
    return request(app)
      .get(`/api/tasks?status=${status}`)
      .expect(400)
      .then((response) => {
        const error = response.body;

        expect(error.msg).toBe("Invalid status value.");
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
        expect(error.msg).toBe("Task not found.");
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

  test("STATUS 201: returns a new task with a HTML in title/description escaped", async () => {
    const body = {
      title: "<script>alert('XSS')</script>",
      description: "<img src='x' onerror='stealCookies()'>",
      status: "Pending",
      due_date: formattedFutureDate,
    };

    const res = await request(app).post("/api/tasks").send(body).expect(201);

    expect(res.body.task.title).not.toMatch(/<script>/i);
    expect(res.body.task.description).toMatch(
      /onerror=&#x27;stealCookies\(\)&#x27;/
    );
  });
  test("STATUS 400: returns an error when the request body does not contain all the required values (title)", () => {
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
        expect(response.body.errors[0].msg).toBe("Title is required.");
      });
  });

  test("STATUS 400: returns an error when the request body does not contain all the required values (due date)", async () => {
    const body = {
      title: "Task without due date",
      description: "This will fail",
    };

    const response = await request(app)
      .post("/api/tasks")
      .send(body)
      .expect(400);
    expect(response.body.errors[0].msg).toBe("Due date is required.");
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
        expect(response.body.errors[0].msg).toBe("Invalid due date format.");
      });
  });

  test("STATUS 400: invalid status value ", async () => {
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
    expect(response.body.errors[0].msg).toBe("Invalid status value.");
  });
});

describe("PATCH /api/tasks/:task_id", () => {
  test("STATUS 200: successfully updates the task status", () => {
    const newStatus = "Completed";
    const body = { status: newStatus };

    return request(app)
      .patch("/api/tasks/1")
      .send(body)
      .expect(200)
      .then((response) => {
        const task = response.body.task;
        expect(task.status).toBe(newStatus);
      });
  });
  test("STATUS 200: returns an updated task specified by task_id (change status to In Progress and then to Completed - multiple operations)", () => {
    const newStatus = "In Progress";
    const body = { status: newStatus };

    return request(app)
      .patch("/api/tasks/2")
      .send(body)
      .expect(200)
      .then((response) => {
        const task = response.body.task;
        expect(task.status).toBe(newStatus);

        const newStatus2 = "Completed";
        const body2 = { status: newStatus2 };

        return request(app)
          .patch("/api/tasks/2")
          .send(body2)
          .expect(200)
          .then((response) => {
            const task = response.body.task;
            expect(task.status).toBe(newStatus2);
          });
      });
  });
  test("STATUS 404: returns an error when passed non-existent but valid task_id", () => {
    const newStatus = "Completed";
    const body = { status: newStatus };

    return request(app)
      .patch("/api/tasks/9999")
      .send(body)
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Task not found.");
      });
  });
  test("STATUS 400: returns an error when passed invalid task_id", () => {
    const newStatus = "Completed";
    const body = { status: newStatus };

    return request(app)
      .patch("/api/tasks/not-valid")
      .send(body)
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Bad request.");
      });
  });
  test("STATUS 400: returns an error if status is not provided", () => {
    const body = {};

    return request(app)
      .patch("/api/tasks/2")
      .send(body)
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Status is required.");
      });
  });
  test("STATUS 400: returns an error if invalid status is provided", () => {
    const newStatus = "Not a valid status";
    const body = { status: newStatus };

    return request(app)
      .patch("/api/tasks/1")
      .send(body)
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Invalid status value.");
      });
  });
});

describe("DELETE /api/tasks/:task_id", () => {
  test("STATUS 204: returns correct status after deleting a task", () => {
    return request(app).delete("/api/tasks/1").expect(204);
  });
  test("STATUS 404: returns an error when passed non-existent but valid task_id", () => {
    return request(app)
      .delete("/api/tasks/9999")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Task not found.");
      });
  });
  test("STATUS 400: returns an error when passed invalid task_id", () => {
    return request(app)
      .delete("/api/tasks/not-valid")
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Bad request.");
      });
  });
});
