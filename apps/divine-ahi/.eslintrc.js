/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@ahiakea/eslint-config/next.js','plugin:@react-three/recommended', 'plugin:tailwindcss/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
