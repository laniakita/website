#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- doesn't run in the browser, so this is fine */
import path from 'node:path';
import { readdir, access } from 'node:fs/promises';
import matter from 'gray-matter';
import { getPlaiceholder } from 'plaiceholder';
import { metadata } from '@/app/layout';

const debugAll = false;
let debugFetchPaths = false;
let debugProcessMdx = false;

if (debugAll) {
  debugFetchPaths = true;
  debugProcessMdx = true;
}

// useful funcs
const isNonEmptyArrayOfStrings = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string');
};

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

    if (isNonEmptyArrayOfStrings(finalArr)) return finalArr;

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

interface BatchFetchFrontMatterProps extends ConfigProps {
  pathsArr?: string[];
  imageKey?: string;
  publicPath?: string; // i.e. 'assets/images/blog/heros'
}

/*
 * @example batchFetchFrontMatter([pathsArr])
 * () => [{front matter post0}, ..., {front matter postN}]
 */
const batchFetchFrontMatter = async ({
  pathsArr,
  imageKey,
  publicPath,
  debug,
  suppressErr,
}: BatchFetchFrontMatterProps) => {
  if (debugProcessMdx) {
    debug = true;
  }
  if (!pathsArr) return;

  try {
    const cwd = process.cwd();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
    const newimageEmbedPath = async ({
      fmatter,
      mdxPath,
    }: {
      fmatter: Record<string, any>;
      mdxPath: string;
    }): Promise<string | undefined> => {
      if (imageKey && imageKey in fmatter) {
        debug && console.log('found hero image with key', imageKey);

        let imageType = 'type' in fmatter && fmatter[`type`];

        const currentImagePath = fmatter[imageKey];
        //console.log(currentImagePath)

        const splitStr = mdxPath.split('/');
        // need to get parent path before mutating array with pop.
        const parentPath = splitStr.slice(0, splitStr.length - 1).join('/');
        //console.log(parentPath)

        // now we can get the mdx file name to use as the folder later.
        const mdxFile = splitStr.pop();
        if (!mdxFile) return;
        const mdxFileSlug = mdxFile.split('.')[0];
        //console.log(mdxFileSlug)

        const imgToCopyFilePath = path.resolve(parentPath, currentImagePath);
        //console.log(imgToCopyFilePath)

        const publicCopyPath = `/public/${publicPath}/${imageType ? `${imageType}/` : `/`}${mdxFileSlug}/${fmatter[imageKey].split('/').pop()}`;

        //console.log(publicCopyPath)

        const embedPublicCopyPath = `/${publicPath}/${imageType ? `${imageType}/` : `/`}${mdxFileSlug}/${fmatter[imageKey].split('/').pop()}`;
        //console.log(embedPublicCopyPath)

        const pathToCheck = path.join(cwd, publicCopyPath);
        //console.log(pathToCheck)
        const constPublicImgFile = Bun.file(pathToCheck);
        const imgFile = Bun.file(imgToCopyFilePath);

        /*
         * If the file isn't in the public folder, then copy it.
         * If an image already exists in the public folder,
         * but the declared frontmatter image is
         * different (diff in size), then replace it.
         */
        const checkImg = await constPublicImgFile.exists();

        if (!checkImg) {
          console.log('image not in public folder, copying ...');
          //await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile);
        } else if (constPublicImgFile.size !== imgFile.size) {
          console.log('found image is different from public folder, copying ...');
          //await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile);
        } else {
          console.log('image is the same, not copying');
        }

        return embedPublicCopyPath;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
    const imgMetaPlusBlurryPlaiceHolders = async ({
      fmatter,
      mdxPath,
    }: {
      fmatter: Record<string, any>;
      mdxPath: string;
    }) => {
      if (imageKey && imageKey in fmatter) {
        console.log(`using ${fmatter[imageKey]} to generate img data + blurs`);
        const currentImagePath = fmatter[imageKey];
        const splitStr = mdxPath.split('/');
        const parentPath = splitStr.slice(0, splitStr.length - 1).join('/');
        const imgToCopyFilePath = path.resolve(parentPath, currentImagePath);

        const imgFile = Bun.file(imgToCopyFilePath);
        const arrayBuf = await imgFile.arrayBuffer();
        const buf = Buffer.from(arrayBuf);

        const {
          base64,
          metadata: { height, width },
        } = await getPlaiceholder(buf);

        return { base64, height, width };
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
    const comboImageProcessing = async ({ fmatter, mdxPath }: { fmatter: Record<string, any>; mdxPath: string }) => {
      if (imageKey && imageKey in fmatter) {
        // need to do this first (the other function seems to mutate something)
        const imgBlurPlusMetaRes = await imgMetaPlusBlurryPlaiceHolders({ fmatter: fmatter, mdxPath: mdxPath });
        const imgBlurData = imgBlurPlusMetaRes?.base64;
        const imgHeight = imgBlurPlusMetaRes?.height;
        const imgWidth = imgBlurPlusMetaRes?.width;

        const newImgPath = await newimageEmbedPath({ fmatter: fmatter, mdxPath: mdxPath });
        fmatter[imageKey] = newImgPath;
        return { ...fmatter, imgBlur: imgBlurData, imgHeight: imgHeight, imgWidth: imgWidth };
      }
    };

    const injectUUID = async ({ rawFile, absFilePath }: { rawFile: string; absFilePath: string }) => {
      const uuid = crypto.randomUUID();
      const fileArr = rawFile.split('\n');

      // we need to search the file string to find out where
      // we can safely inject the uuid.
      const getInjectionPoint = fileArr.map((strLine, index) => {
        // we're going to look for the first "---" of the front matter
        // then inject. We can test that we're not adding at the end by
        // checking if the key following injection is valid
        const keyGuess = fileArr[index + 1]?.split(':')[0]!;
        const point = index + 1;
        if (strLine === '---' && keyGuess) {
          debug && console.log('inject at ', index + 1, 'before ', keyGuess);

          return point;
        }
        return;
      });

      const injectionPoint = getInjectionPoint.filter((el) => el)[0];
      if (typeof injectionPoint !== 'number') return;
      fileArr.splice(injectionPoint, 0, `id: ${uuid}`);

      const finalString = fileArr.join('\n');

      const fileWritePath = absFilePath;

      debug && console.log(`saving updated markdown file to `, fileWritePath);

      await Bun.write(fileWritePath, finalString);
      const newMatter = matter(finalString).data;

      // we'll need to update the image path in memory, if it exists

      return newMatter;
    };

    const matterMeta = await Promise.all(
      pathsArr.map(async (mdxPath: string) => {
        const absFilePath = path.resolve(path.join(cwd, mdxPath));
        const readIntoMem = Bun.file(absFilePath);
        const rawFile = await readIntoMem.text();
        const frontMatter = matter(rawFile).data;

        /*
         * before we send the frontmatter into our db, we need to ensure
         * it has a UUID first. This is to provide some continuity
         * for our posts, in the event we need to reconstruct the database.
         *
         * This way, even if shtf, if you've got a link to a post
         * (i.e. bookmark), it's likely you'll still be able to find it years
         * down the line.
         */
        if ('id' in frontMatter === false) {
          debug && console.log('no uuid found, injecting...');
          const newMatter = await injectUUID({absFilePath: absFilePath, rawFile: rawFile});
          return newMatter
        }
        debug && console.log(`uuid found in front matter with ${frontMatter.id}, not injecting`);

        return frontMatter;
      }),
    );

    debug && console.log(matterMeta);

    return matterMeta;
  } catch (err) {
    !suppressErr && console.error(err);
    return;
  }
};

export const batchFetchMain = async (config: ConfigProps & BatchFetchFrontMatterProps) => {
  const validMdxPaths = await batchFetchMDXPaths(config);
  const frontMatterArr = await batchFetchFrontMatter({
    ...config,
    pathsArr: validMdxPaths!,
    imageKey: config.imageKey,
    publicPath: config.publicPath,
  });
  config.debug && console.log(frontMatterArr);
  return frontMatterArr;
};
