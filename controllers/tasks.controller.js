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

export const postTask = (req, res, next) => {
  const body = req.body;

  insertTask(body)
    .then((task) => {
      res.status(201).send({ task });
    })
    .catch((err) => {
      next(err);
    });
};
