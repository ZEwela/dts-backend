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
