import format from "pg-format";
import db from "../connection.js";

const seed = ({ tasks }) => {
  return db
    .query(`DROP TABLE IF EXISTS tasks;`)
    .then(() => {
      return db.query(`CREATE TABLE tasks (
            task_id SERIAL PRIMARY KEY,
            title VARCHAR NOT NULL,
            description TEXT,
            status VARCHAR CHECK (status IN('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
            due_date TIMESTAMP
            )
        `);
    })
    .then(() => {
      const insertTasksQueryStr = format(
        "INSERT INTO tasks (title, description, status, due_date) VALUES %L RETURNING *;",
        tasks.map(({ title, description, status, due_date }) => [
          title,
          description,
          status || "Pending",
          due_date,
        ])
      );
      return db.query(insertTasksQueryStr);
    })
    .then(() => {
      console.log("Tasks table created and sample tasks inserted!");
    })
    .catch((err) => {
      console.error("Error setting up tasks table:", err);
    });
};

export default seed;
