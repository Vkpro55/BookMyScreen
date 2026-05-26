import { defineConfig, globalIgnores } from "eslint/config";

import { baseConfig } from "@repo/eslint-config/base";
import { reactConfig } from "@repo/eslint-config/react";

export default defineConfig([
  globalIgnores(["dist", "node_modules", ".turbo", "coverage"]),
  baseConfig,
  reactConfig,
]);
