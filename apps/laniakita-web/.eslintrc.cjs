/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ['next-on-pages'],
  extends: [
    '@ahiakea/eslint-config/next.cjs',
    'plugin:@react-three/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:next-on-pages/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
