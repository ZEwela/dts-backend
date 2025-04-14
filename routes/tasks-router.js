import express from "express";
import { getTaskById, postTask } from "../controllers/tasks.controller.js";

export const tasksRouter = express.Router();

tasksRouter.route("/:task_id").get(getTaskById);
tasksRouter.route("/").post(postTask);
