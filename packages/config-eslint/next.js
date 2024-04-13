const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "plugin:tailwindcss/recommended",
    "next/core-web-vitals",
    "prettier",
    "eslint-config-turbo",
  ].map(require.resolve),
  parserOptions: { project },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [".next", "dist", "node_modules/"],
  rules: {
    "import/prefer-default-export": "warn",
    "no-console": ["warn", { allow: ["error"] }],
    "no-unused-vars": "warn",
    "no-var": "error",
    "@next/next/no-html-link-for-pages": "warn",
    "prefer-const": "warn",
  },
};
