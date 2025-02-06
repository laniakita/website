import { nextJsConfig } from '@website/eslint-config-v9/next-js';
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// legacy compat
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

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
      '.contentlayermini/*',
      '.contentlayerplushtml/*',
      'sst-env.d.ts',
    ],
  },
  ...fixupConfigRules(compat.extends('plugin:@react-three/recommended'))
];

export default webConfig;
