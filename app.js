import express from "express";

import apiRouter from "./routes/api-router.js";

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

export default app;
