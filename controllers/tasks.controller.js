import {
  insertTask,
  selectTaskById,
  selectAllTasks,
  updateTaskById,
  deleteTaskById,
} from "../models/tasks.model.js";

export const getAllTasks = (req, res, next) => {
  let { status } = req.query;

  if (status) {
    const validStatuses = ["Pending", "In Progress", "Completed", "All"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ msg: "Invalid status value." });
    }
  }

  selectAllTasks(status)
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

export const patchTaskStatusByTaskId = (req, res, next) => {
  const taskId = req.params.task_id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send({ msg: "Status is required." });
  }

  const validStatuses = ["Pending", "In Progress", "Completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).send({ msg: "Invalid status value." });
  }

  selectTaskById(taskId)
    .then((task) => {
      return updateTaskById(taskId, status);
    })
    .then((updatedTask) => {
      res.status(200).send({ task: updatedTask });
    })
    .catch((err) => {
      next(err);
    });
};

export const removeTaskByTaskId = (req, res, next) => {
  const taskId = req.params.task_id;

  deleteTaskById(taskId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
