#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- doesn't run in the browser, so this is fine */
import path from 'node:path';
import { readdir, access } from 'node:fs/promises';
import matter from 'gray-matter';

const debugAll = false;
let debugFetchPaths = false;
let debugProcessMdx = false;

if (debugAll) {
  debugFetchPaths = true;
  debugProcessMdx = true;
}

// useful funcs
const isNonEmptyArrayOfStrings = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.length > 0 && value.every(item => typeof item === "string");
}

interface ConfigProps {
  // must be relative path from root project directory => './content'
  contentFolder: string;
  // array of relative paths INSIDE the content folder ['./assets']
  foldersToExclude?: string[];
  // array of literal file name/ext => ['README.md']
  filesToExclude?: string[];
  // debug
  debug?: boolean;
  suppressErr?: boolean;
}

const defaultConfig: ConfigProps = {
  contentFolder: './content',
  foldersToExclude: ['./assets'],
  filesToExclude: ['LICENSE', 'README.md'],
};

/*
 * @example batchFetchMDXPaths({config})
 * () => ['./content/blog/post0.mdx', ..., './content/blog/postN.md']
 */
export const batchFetchMDXPaths = async ({
  contentFolder,
  foldersToExclude,
  filesToExclude,
  debug,
  suppressErr,
}: ConfigProps): Promise<string[] | undefined> => {
  try {
    if (debugFetchPaths) {
      debug = true;
    }

    const dir = await readdir(contentFolder, { recursive: true });

    const excludedFolders = foldersToExclude?.map((folder) => {
      const cleanedFolderPath = folder.replace('./', '');

      return cleanedFolderPath;
    });

    //const absPath = path.resolve(path.join(process.cwd(), contentFolder))

    const fileArr = dir.map((item) => {
      debug && console.log('logging raw path:', item);

      let folderSkip = false;
      let fileSkip = false;

      if (excludedFolders?.some((folder) => item.startsWith(folder))) {
        folderSkip = true;
        debug && console.log('skipping ', item);
      }

      if (!folderSkip && filesToExclude?.some((file) => item.endsWith(file))) {
        fileSkip = true;
        debug && console.log('ommitting ', item);
      }

      if (!folderSkip && !fileSkip && item.endsWith('.mdx' || '.md')) {
        return `${contentFolder}/${item}`;
      }

      return undefined;
    });

    // validate found paths
    const cwd = process.cwd();
    const validatedArr = await Promise.all(
      fileArr.map(async (pathStr) => {
        try {
          await access(path.resolve(path.join(cwd, pathStr!)));
          return pathStr;
        } catch (err) {
          return;
        }
      }),
    );

    const finalArr = validatedArr.filter((el) => el);

    debug && console.log(finalArr);

    if (isNonEmptyArrayOfStrings(finalArr)) return finalArr

    return;
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      !suppressErr &&
        console.error(
          "Ooops! Couldn't open that directory! Are you sure that folder is relative to root your project directory, i.e. './src/content/posts'? ",
          err,
        );
      return;
    }
    !suppressErr && console.error(err);
    return;
  }
};

debugFetchPaths && console.log(await batchFetchMDXPaths(defaultConfig));

interface BatchFetchFrontMatterProps {
  pathsArr: string[];
  debug?: boolean;
  suppressErr?: boolean;
}



/*
 * @example batchFetchFrontMatter([pathsArr])
 * () => [{front matter post0}, ..., {front matter postN}]
 */
const batchFetchFrontMatter = async ({pathsArr, debug, suppressErr}: BatchFetchFrontMatterProps) => {
  if (debugProcessMdx) {
    debug = true
  }

  try {
    const cwd = process.cwd();
    const matterMeta = await Promise.all(
      pathsArr.map(async (mdxPath: string) => {
        const absFilePath = path.resolve(path.join(cwd, mdxPath));
        const readIntoMem = Bun.file(absFilePath);
        const rawFile = await readIntoMem.text();
        //console.log(rawFile)
        const frontMatter = matter(rawFile).data;
        if ('uuid' in frontMatter === false) {
          debug && console.log(crypto.randomUUID())
          // todo inject uuid above and write into file location 
          // also mv file to a slugified headline if different
        }
        return frontMatter
      }),
    );

    debug && console.log(matterMeta)

    return matterMeta
  } catch (err) {
    !suppressErr && console.error(err);
    return
  }
};

export const batchFetchMain = async (config: ConfigProps) => {
  const validMdxPaths = await batchFetchMDXPaths(config);
  const frontMatterArr = await batchFetchFrontMatter({pathsArr: validMdxPaths!})
  config.debug && console.log(frontMatterArr)
  return frontMatterArr;
}

