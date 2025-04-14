import express from "express";
import {
  getAllTasks,
  getTaskById,
  patchTaskStatusByTaskId,
  postTask,
} from "../controllers/tasks.controller.js";

export const tasksRouter = express.Router();

tasksRouter.route("/:task_id").get(getTaskById).patch(patchTaskStatusByTaskId);
tasksRouter.route("/").get(getAllTasks).post(postTask);
