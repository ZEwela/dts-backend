import db from "../db/connection.js";

export const selectAllTasks = async (status) => {
  let query = "SELECT * FROM tasks";
  let params = [];
  if (status && status !== "All") {
    query += " WHERE status = $1";
    params.push(status);
  }
  const result = await db.query(query, params);
  return result.rows;
};

export const selectTaskById = async (taskId) => {
  const response = await db.query(
    `SELECT *
        FROM tasks
        WHERE tasks.task_id = $1;`,
    [taskId]
  );
  const task = response.rows[0];
  if (!task) {
    return Promise.reject({ status: 404, msg: "Task not found." });
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

export const updateTaskById = async (taskId, status) => {
  const response = await db.query(
    `UPDATE tasks SET status = $1 WHERE task_id = $2 RETURNING *;`,
    [status, taskId]
  );

  const task = response.rows[0];
  return task;
};

export const deleteTaskById = async (taskId) => {
  return db
    .query(`DELETE FROM tasks WHERE task_id = $1 RETURNING *;`, [taskId])
    .then((response) => {
      const deletedComment = response.rows[0];
      if (!deletedComment) {
        return Promise.reject({ status: 404, msg: "Task not found." });
      }
    });
};
