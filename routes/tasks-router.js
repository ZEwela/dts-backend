import express from "express";
import { getTaskById } from "../controllers/tasks.controller.js";

export const tasksRouter = express.Router();

tasksRouter.route("/:task_id").get(getTaskById);
