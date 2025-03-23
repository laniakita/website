import { nextJsConfig } from '@website/eslint-config/next-js';
import { globalIgnores } from "eslint/config";
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
//import pluginNext from "@next/eslint-plugin-next";

// legacy compat
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const webConfig = [
  ...nextJsConfig,
  globalIgnores([
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
    '.content-collections/*',
    '.content-collections-plus-html/*',
    'sst-env.d.ts',
    '.source/*',
  ]),
  ...fixupConfigRules(compat.extends('plugin:@react-three/recommended')),
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    settings: {
      next: {
        rootDir: '.',
      },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },


  }),];

export default webConfig;
