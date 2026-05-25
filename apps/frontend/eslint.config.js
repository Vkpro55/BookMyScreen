import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint, { parser } from "typescript-eslint"
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
    ".turbo",
    "coverage",
  ]),

  js.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],

    languageOptions: {
      parser,
      parserOptions: {
        project: [
          path.join(__dirname, "tsconfig.app.json"),
          path.join(__dirname, "tsconfig.node.json"),
        ],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      "unused-imports": unusedImports,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      /*
       * React
       */
      "react/react-in-jsx-scope": "off",

      /*
       * React Hooks
       */
      ...reactHooks.configs.recommended.rules,

      /*
       * Vite HMR
       */
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      /*
       * Imports
       */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      /*
       * Unused imports
       */
      "unused-imports/no-unused-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      /*
       * TypeScript strictness
       */
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
    },
  },

  prettier,
]);