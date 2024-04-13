/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@ahiakea/eslint-config/next.js", "plugin:tailwindcss/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
}
