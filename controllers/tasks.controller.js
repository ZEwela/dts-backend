import {
  insertTask,
  selectTaskById,
  selectAllTasks,
} from "../models/tasks.model.js";

export const getAllTasks = (req, res, next) => {
  selectAllTasks()
    .then((tasks) => {
      res.status(200).send({ tasks });
    })
    .catch((err) => {
      next(err);
    });
};

export const getTaskById = (req, res, next) => {
  const taskId = req.params.task_id;
  selectTaskById(taskId)
    .then((task) => {
      res.status(200).send({ task });
    })
    .catch((err) => {
      next(err);
    });
};

export const postTask = async (req, res, next) => {
  try {
    const { title, description, status = "Pending", due_date } = req.body;

    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ msg: "Invalid status value." });
    }

    if (!title || !due_date) {
      return res
        .status(400)
        .send({ msg: "Bad request. Missing required fields." });
    }

    const task = await insertTask({ title, description, status, due_date });
    res.status(201).send({ task });
  } catch (err) {
    next(err);
  }
};
