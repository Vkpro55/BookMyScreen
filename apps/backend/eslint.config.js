import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import globals from "globals";
import tseslint, { parser } from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import promisePlugin from "eslint-plugin-promise";
import prettier from "eslint-config-prettier";

import { defineConfig, globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores(["dist", "node_modules", ".turbo", "coverage"]),

  js.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],

    languageOptions: {
      parser,
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      promise: promisePlugin,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",

      "promise/catch-or-return": "error",

      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  prettier,
]);
