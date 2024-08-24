#! /usr/bin/env bun
const cwd = process.cwd();

// read package.json
interface Package {
  dependencies: Record<string, unknown>[],
  devDependencies: Record<string, unknown>[],
}

const getJson = async (path?: string): Promise<Package | undefined> => {
  try {
    const packageDataRaw = Bun.file(path ?? `${cwd}/package.json`);
    const packageDataStr: unknown = await packageDataRaw.text();
    const packageData: unknown = JSON.parse(packageDataStr as string);
    return packageData as Package
  } catch (err) {
    console.error(err);
    return undefined
  }
};

// versions.json config
interface Versions {
  versions?: Package;
}

interface Config {
  package_json_path?: string;
  versions_path?: string;
  packages: { 
    dependencies?: string[];
    devDependencies?: string[];
  }
}

const getVersionJson = async ({versionPath, config}:{versionPath?: string, config?: Versions}) => {
  try {
    //todo: 
    // - mkdir to file recursively
    // - create versions on ENOENT
    const outputPath = versionPath ?? `${cwd}/src/gen/versions.json`
    const versionsMem = Bun.file(outputPath);
    const versionStr: unknown = await versionsMem.text();
    const versionData: unknown = JSON.parse(versionStr as string);

    if ((versionData as Versions).versions as unknown === '' || !(versionData as Versions).versions) {
      console.debug('versions.json empty. Generating defaults.')
      const defaultVersions = {
        versions: {
          dependencies: {
            next: null,
          },
        },
      };
      await Bun.write(outputPath, JSON.stringify(config ?? defaultVersions));
    }

  } catch (err) {
    console.error(err);
  }
};

// next.js script

const genVersions = async (config: Config) => {
  try {
  const packageJsonRes = await getJson(config.package_json_path);
  const packageJson = packageJsonRes!;
  const versionsGenDeps = config.packages.dependencies?.map((pkg) => {
    const matchPkg = pkg as keyof typeof packageJson.dependencies
    const dependenciesArr = new Map([
      [pkg, packageJson.dependencies[matchPkg]]
    ]);
    const genDepObj = Object.fromEntries(dependenciesArr);
    return genDepObj;
  })
  // todo devDependencies
  
  return {
    versions: {
      dependencies: versionsGenDeps,
    }
  }

  } catch (err) {
    console.error(err)
  }
}

const laniConfig: Config = {
  packages: {
    dependencies: ["next"]
  }
}

console.dir(await genVersions(laniConfig), {depth: null})

//const nextVersion = (packageData as Package).dependencies.next;

