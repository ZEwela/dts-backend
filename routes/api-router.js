import express from "express";

const apiRouter = express.Router();
import { tasksRouter } from "./tasks-router.js";

apiRouter.use("/tasks", tasksRouter);

export default apiRouter;
