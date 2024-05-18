const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
    "eslint-config-turbo",
  ].map(require.resolve),
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
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": "warn",
    "prefer-named-capture-group": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/restrict-template-expressions": [
      "warn",
      { allowNumber: true },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
