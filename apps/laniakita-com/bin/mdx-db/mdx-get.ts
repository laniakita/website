#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- doesn't run in the browser, so this is fine */
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import matter from 'gray-matter';

const debugAll = false;
let debugFetchPaths = false;
let debugProcessMdx = false;

if (debugAll) {
  debugFetchPaths = true;
  debugProcessMdx = true;
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
  suppressErr
}: ConfigProps): Promise<(string | undefined)[] | undefined> => {
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

    const finalArr = fileArr.filter((el) => el);
    debug && console.log(finalArr);
    return finalArr;
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      !suppressErr && console.error(
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

/*
const batchFetchFrontMatter = async (pathsArr: string[]) => {
  try {
    const matterMeta = await Promise.all(
      pathsArr.map(async (mdxPath: string) => {
        const metaObj 
        return metaObj;
      }),
    );
    const sortedMetas = matterMeta.sort((a, b) => {
      return b.date - a.date;
    });
    return sortedMetas;
  } catch (err) {
    console.error(err);
    return [''];
  }
};

*/
