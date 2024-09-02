/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@website/eslint-config/next.cjs',
    'plugin:@react-three/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    "import/no-extraneous-dependencies": "off",
  },
};
