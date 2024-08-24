#! /usr/bin/env bun
/* eslint-disable no-console -- local script */
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import merge, { assign }  from 'lodash'

const cwd = process.cwd();

// read package.json
interface Package {
  dependencies: Record<string, string>[];
  devDependencies: Record<string, string>[];
}

const getJson = async (pkgPath?: string): Promise<Package | undefined> => {
  try {
    const packageDataRaw = Bun.file(pkgPath ?? `${cwd}/package.json`, { type: 'application/json' });
    const packageDataStr = await packageDataRaw.text();
    const packageData = JSON.parse(packageDataStr) as Package;
    return packageData;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

interface Config {
  allow_custom_path?: boolean;
  package_json_path?: string;
  versions_path?: string;
  packages: {
    dependencies?: string[];
    devDependencies?: string[];
  };
}

class PVSError extends Error {
  statusCode: string;

  constructor(message: string, statusCode: string) {
    super(message);
    this.name = 'PVSError';
    this.statusCode = statusCode;
  }

  errLog() {
    console.error(`[ERROR]: PVS Error ${this.statusCode}: ${this.message}`);
  }
  warnLog() {
    console.warn(`[WARNING]: PVS Error ${this.statusCode}: ${this.message}`);
  }
}

const defaults = {
  output_path: `${cwd}/.package-version-saver/out.json`,
};

// For internal use only.
const dangerousSaver = async (config: Config): Promise<200 | 500> => {
  try {
    const resGen = await genVersions(config);
    const validOutPath = config.versions_path ?? defaults.output_path;
    await Bun.write(validOutPath, JSON.stringify(resGen));
    console.log(`[SUCCESS]: wrote ${validOutPath.split('/').pop()} to ${validOutPath}.`);
    return 200;
  } catch (err) {
    console.error(err);
    return 500;
  }
};

const parentDir = (pathStr: string) => {
  const pathRes = pathStr.split('/').slice(0, -1).join('/');
  return pathRes;
};

const getVersionJson = async (config: Config) => {
  try {
    const outputPath = config.versions_path ?? defaults.output_path;
    const dirPath = parentDir(outputPath);
    // check if parent path exists
    const dirExists = existsSync(dirPath);
    if (!dirExists) {
      throw new PVSError(`Oops ${dirPath} doesn't exist.`, '404Path');
    }

    // check if out.json exists
    const versionsMem = Bun.file(outputPath, { type: 'application/json' });
    const outExists = await versionsMem.exists();
    if (!outExists) {
      throw new PVSError(`${outputPath} doesn't exist.`, '404Out');
    }

    // todo: deal with old out.json
    /*
    const versionStr = await versionsMem.text();
    const versionData = JSON.parse(versionStr) as Versions;

    if ((versionData.versions as unknown) === '' || !(versionData.versions)) {
      console.debug('versions.json empty. Generating defaults.');
      const defaultVersions = {
        versions: {
          dependencies: {
            next: null,
          },
        },
      };
      await Bun.write(outputPath, JSON.stringify(config.versions_path ?? defaultVersions));
    }*/

    return await dangerousSaver(config);
  } catch (err) {
    if (err instanceof PVSError) {
      if (err.statusCode === '404Path') {
        if (config.versions_path && !config.allow_custom_path) {
          err.errLog();
          console.error(
            'Reccomendation(s):',
            '\n',
            '1. Create the missing directory.',
            '\n',
            '2. Allow PVS to create it in the .package-version-saver.ts config.',
          );
        } else if (!config.versions_path || (config.allow_custom_path && config.versions_path)) {
          const outputPathErr = config.versions_path ?? defaults.output_path;
          const parentOut = parentDir(outputPathErr);
          err.warnLog();
          console.info(`[INFO]: creating directory at ${parentOut}.`);

          try {
            await mkdir(parentOut, { recursive: true });
            if (existsSync(parentOut)) {
              console.info(`[SUCCESS]: created directory at ${parentOut}`);
              // continue
              await getVersionJson(config);
            }
          } catch (err2) {
            console.error(err2);
          }
        }
      } else if (err.statusCode === '404Out') {
        err.warnLog();
        console.info('[INFO]: No previous backups found. First time, huh? ;3');
        return await dangerousSaver(config);
      }
    }
  }
};

interface GenVersions {
  versions: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

const genVersions = async (config: Config): Promise<GenVersions | undefined> => {
  try {
    const packageJsonRes = await getJson(config.package_json_path);
    const packageJson = packageJsonRes!;

    

    // dependencies
    const versionsGenDeps = config.packages.dependencies
      ?.map((pkg): [string, string] => {
        const matchPkg = pkg as keyof typeof packageJson.dependencies;
        const val = packageJson.dependencies[matchPkg];
        
        return [pkg, typeof(val) === 'string' ? val : 'undefined']
      
      })
    
    const depObj = versionsGenDeps ? Object.fromEntries(versionsGenDeps) : {}
    
    
    // devDependencies
      const versionsGenDevDeps = config.packages.devDependencies
      ?.map((pkg): [string, string] => {
        const matchPkg = pkg as keyof typeof packageJson.devDependencies;
        const val = packageJson.devDependencies[matchPkg];
        
        return [pkg, typeof(val) === 'string' ? val : 'undefined']
      
      })
    
    const devObj = versionsGenDevDeps ? Object.fromEntries(versionsGenDevDeps) : {}    
    return {
      versions: {
        dependencies: depObj,
        devDependencies: devObj,
      },
    };
  } catch (err) {
    console.error(err);
  }
};

const laniConfig: Config = {
  packages: {
    dependencies: ['next', '@next/mdx'],
  },
};

export const pkgVersionSaver = async (config: Config) => {
  const t0 = performance.now();
  const resSaver = await getVersionJson(config);

  if (resSaver === 200) {
    const t1 = performance.now();
    console.log(`[SUCCESS]: All done! Package Version Saver finished in under ${t1 - t0} ms!`);
    return 200;
  }

  if (resSaver === 500) {
    const t1 = performance.now();
    console.error(`[ERROR]: Oh no! Something's gone wrong in under ${t1 - t0} ms! >.< Maybe the console can help?`);
    return 500;
  }
};

console.log(await pkgVersionSaver(laniConfig));

//const nextVersion = (packageData as Package).dependencies.next;
