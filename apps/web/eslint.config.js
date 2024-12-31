import { nextJsConfig } from '@website/eslint-config-v9/next-js';

/** @type {import("eslint").Linter.Config} */
/**
 * Eslint config for web a next.js app.
 *
 * @type {import("eslint").Linter.Config}
 * */
const webConfig = [
  ...nextJsConfig,
  {
    ignores: [
      '.config/*',
      '**/*.js',
      '**/*.mjs',
      '.contentlayer/*',
      '.versionvault/*',
      '.vercel/*',
      '.wrangler/*',
      '.turbo/*',
      '.next/*',
      '.tmp/*',
      '.open-next/*',
      'node_modules/*',
      'contentlayermini/*',
      'sst-env.d.ts',
    ],
  },
];

export default webConfig;
