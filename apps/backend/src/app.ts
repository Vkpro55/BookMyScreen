import express from "express";
import type { Express } from "express";
import router from "./routes/index.js";

const app: Express = express();
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (_, res) => {
  res.send("Hello Welcome");
});

export default app;
