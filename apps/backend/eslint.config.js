import { defineConfig, globalIgnores } from "eslint/config";

import { baseConfig } from "@repo/eslint-config/base";

export default defineConfig([
  globalIgnores(["dist", "node_modules", ".turbo", "coverage"]),
  baseConfig,
]);
