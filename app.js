import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router.js";
import {
  handleCustomErrors,
  handlePSQLErrors,
} from "./controllers/errors.controller.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

export default app;
