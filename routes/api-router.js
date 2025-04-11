import express from "express";

const apiRouter = express.Router();

// Test route
apiRouter.get("/test", (req, res) => {
  res.status(200).send("API is working!");
});

export default apiRouter;
