import { globalIgnores } from "eslint/config";

import { baseConfig } from "@repo/eslint-config/base";
import { reactConfig } from "@repo/eslint-config/react";

export default [
  globalIgnores(["dist", "node_modules", ".turbo", "coverage"]),

  ...baseConfig,

  reactConfig,
];