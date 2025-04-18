import {
  insertTask,
  selectTaskById,
  selectAllTasks,
  updateTaskById,
  deleteTaskById,
} from "../models/tasks.model.js";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { body, validationResult } from "express-validator";

export const getAllTasks = (req, res, next) => {
  let { status, page = 1, limit = 10 } = req.query;

  if (status) {
    const validStatuses = ["Pending", "In Progress", "Completed", "All"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ msg: "Invalid status value." });
    }
  }

  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page <= 0) {
    return res.status(400).send({ msg: "Invalid page number." });
  }

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).send({ msg: "Invalid limit number." });
  }

  selectAllTasks(status, page, limit)
    .then(({ tasks, totalPages }) => {
      res.status(200).send({ tasks, totalPages });
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

export const postTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 50 })
    .withMessage("Title cannot be longer than 50 characters.")
    .escape(),

  body("description")
    .trim()
    .isLength({ max: 225 })
    .withMessage("Description cannot be longer than 225 characters.")
    .optional()
    .escape(),

  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status value."),

  body("due_date")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601()
    .withMessage("Invalid due date format."),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, status = "Pending", due_date } = req.body;
      const window = new JSDOM("").window;
      const purify = DOMPurify(window);

      const sanitizedTitle = purify.sanitize(title);
      const sanitizedDescription = purify.sanitize(description);

      const task = await insertTask({
        sanitizedTitle,
        sanitizedDescription,
        status,
        due_date,
      });
      res.status(201).send({ task });
    } catch (err) {
      next(err);
    }
  },
];

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
