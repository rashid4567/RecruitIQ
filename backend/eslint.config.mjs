import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Prevent debugging code in production
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",

      // TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Warn only (won't fail lint)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    ignores: [
      "dist/**",
      "node_modules/**",
    ],
  },
];