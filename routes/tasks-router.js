import express from "express";
import {
  getAllTasks,
  getTaskById,
  postTask,
} from "../controllers/tasks.controller.js";

export const tasksRouter = express.Router();

tasksRouter.route("/:task_id").get(getTaskById);
tasksRouter.route("/").get(getAllTasks).post(postTask);
