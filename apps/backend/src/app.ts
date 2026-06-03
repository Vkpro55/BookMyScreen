import express from "express";
import type { Express } from "express";
import router from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app: Express = express();
app.use(express.json());

app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

app.get("/", (_, res) => {
  res.send("Hello Welcome");
});

export default app;
