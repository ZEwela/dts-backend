import db from "../db/connection.js";

export const selectTaskById = async (taskId) => {
  const response = await db.query(
    `SELECT *
        FROM tasks
        WHERE tasks.task_id = $1;`,
    [taskId]
  );
  const task = response.rows[0];
  if (!task) {
    return Promise.reject({ status: 404, msg: "Not found." });
  }
  return task;
};

export const insertTask = async ({
  title,
  description,
  status = "Pending",
  due_date,
}) => {
  const queryValues = [title, description, status, due_date];

  const response = await db.query(
    `INSERT INTO tasks
        (title, description, status, due_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`,
    queryValues
  );

  const task = response.rows[0];

  return task;
};
