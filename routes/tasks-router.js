import express from "express";
import {
  getAllTasks,
  getTaskById,
  patchTaskStatusByTaskId,
  postTask,
  removeTaskByTaskId,
} from "../controllers/tasks.controller.js";

export const tasksRouter = express.Router();

tasksRouter
  .route("/:task_id")
  .get(getTaskById)
  .patch(patchTaskStatusByTaskId)
  .delete(removeTaskByTaskId);
tasksRouter.route("/").get(getAllTasks).post(postTask);
