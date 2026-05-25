import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
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

  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["src/**/*.{ts,tsx,js,mjs,cjs}"],

    languageOptions: {
      parserOptions: {
        project: "./apps/frontend/tsconfig.json",
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      promise: promisePlugin,
    },

    rules: {
      "unused-imports/no-unused-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/consistent-type-imports": "error",

      "@typescript-eslint/no-floating-promises": "error",

      "promise/catch-or-return": "error",

      "import/order": [
        "error",
        {
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  prettier,
]);