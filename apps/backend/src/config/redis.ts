import "dotenv/config";
import { Redis } from "ioredis";
import { config } from "./config.js";

/* eslint-disable no-console */

const redis = new Redis({
  host: config.redis_host,
  port: config.redis_port,
  retryStrategy: () => 5000,
});

redis.on("error", (err) => {
  console.error("Redis error ", err);
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

export default redis;
