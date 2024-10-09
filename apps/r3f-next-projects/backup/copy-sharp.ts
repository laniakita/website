#! /usr/bin/env bun
/* eslint-disable camelcase -- that's how it is */
import { cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const cwd = process.cwd();
const monoRepoCorrection = '../../';
const node_modules = join(cwd, monoRepoCorrection, './node_modules');
const openNextServerDefault = join(cwd, '.open-next/server-functions/default');

const sharpInstall = `sharp`;

const sharpDeps = ['color', 'detect-libc', 'semver'];
const colorDeps = ['color-convert', 'color-string'];
const colorStringDeps = ['color-name', 'simple-swizzle'];
// color-convert depends on color-name

const pkgsToCopy = [sharpInstall, ...sharpDeps, ...colorDeps, ...colorStringDeps];

const t0 = performance.now();

export default async function copySharp() {
  try {
    console.info('copying', sharpInstall, 'to:', openNextServerDefault);
    const pkgPaths = pkgsToCopy.map((pkg) => {
      const from = `${node_modules}/${pkg}`;
      const to = `${openNextServerDefault}/node_modules/${pkg}`;
      return {
        source: from,
        dest: to,
      };
    });
    for await (const pkg of pkgPaths) {
      console.info('creating dirs from', pkg.source, 'to:', pkg.dest);
      await mkdir(pkg.dest, { recursive: true });
    }
    for await (const copied of pkgPaths) {
      console.info('copying', copied.source, 'to:', copied.dest);
      await cp(copied.source, copied.dest, { recursive: true });
    }

    console.info('finished in ', performance.now() - t0, `ms`);
  } catch (err) {
    console.error(err);
  }
}

await copySharp();
