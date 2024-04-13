const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: ["eslint-config-turbo"].map(require.resolve),
  parserOptions: { project },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
    node: {
      extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
    },
  },
  ignorePatterns: [".next", "dist", "node_modules/"],
  rules: {
    "import/no-default-export": "off",
  },
};

/* 
 *    "import/prefer-default-export": "warn",
    "no-console": ["warn", { allow: ["error"] }],
    "no-unused-vars": "warn",
    "no-var": "error",
    "@next/next/no-html-link-for-pages": "warn",
    "prefer-const": "warn",
  * */
