import "dotenv/config";
import { defineConfig, env } from "prisma/config";

console.log("prisma.config.ts CWD: ", process.cwd());
console.log("prisma.config.ts DB URL: ", process.env.DATABASE_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
