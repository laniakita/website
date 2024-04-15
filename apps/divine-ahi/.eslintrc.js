/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@ahiakea/eslint-config/next.js', 'plugin:tailwindcss/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
