/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@website/eslint-config/next.cjs', 'plugin:tailwindcss/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-nested-ternary': 'off',
  },
};
