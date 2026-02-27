import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // Allow uppercase vars (components) + JSX namespace tags (motion.div)
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          // Ignore vars that are used only as JSX identifiers (e.g. motion in <motion.div>)
          ignoreRestSiblings: true,
        },
      ],
      // Mark variables used in JSX as "used" — fixes false positives for motion, Icon, etc.
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off", // Not needed with React 17+ JSX transform
    },
  },
]);
