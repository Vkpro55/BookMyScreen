import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import type { JsonObject } from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const app: Express = express();

const openApiFileCandidates = [
  path.join(process.cwd(), "src", "bookMyScreenOpenApi.yaml"),
  path.join(process.cwd(), "apps", "backend", "src", "bookMyScreenOpenApi.yaml"),
  path.join(process.cwd(), "bookMyScreenOpenApi.yaml"),
];

const openApiFilePath = openApiFileCandidates.find((filePath) =>
  fs.existsSync(filePath),
);

if (!openApiFilePath) {
  throw new Error("bookMyScreenOpenApi.yaml file not found");
}

const file = fs.readFileSync(openApiFilePath, "utf8");
const parsedSwaggerDocument: unknown = YAML.parse(file);

if (
  typeof parsedSwaggerDocument !== "object" ||
  parsedSwaggerDocument === null ||
  !("openapi" in parsedSwaggerDocument)
) {
  throw new Error("Invalid OpenAPI document");
}

const swaggerDocument = parsedSwaggerDocument as JsonObject;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  }),
);

app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

app.get("/", (_, res) => {
  res.send("Hello Welcome");
});

export default app;
