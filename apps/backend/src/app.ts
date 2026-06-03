import express from "express";
import type { Express } from "express";
import prisma from "@repo/db/client";

const app: Express = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(`Hello users: ${JSON.stringify(users)}`);
});

export default app;
