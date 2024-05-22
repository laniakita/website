#! /usr/bin/env bun
/* eslint-disable no-undef -- bun runtime will provide bun functions */
/* eslint-disable no-console -- doesn't run in the browser, so this is fine */
import path from 'node:path';
import { readdir, access } from 'node:fs/promises';
import matter from 'gray-matter';
import { getPlaiceholder } from 'plaiceholder';

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

export const defaultConfig: ConfigProps = {
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
    const dir = await readdir(contentFolder, { recursive: true });

    const excludedFolders = foldersToExclude?.map((folder) => {
      const cleanedFolderPath = folder.replace('./', '');

      return cleanedFolderPath;
    });

    //const absPath = path.resolve(path.join(process.cwd(), contentFolder))

    const fileArr = dir.map((item): string | undefined => {
      debug && console.log('logging raw path:', item);

      if (excludedFolders?.some((folder) => item.startsWith(folder))) {
        debug && console.log('skipping ', item);
        return;
      }

      if (filesToExclude?.some((file) => item.endsWith(file))) {
        debug && console.log('ommitting ', item);
        return;
      }

      if (item.endsWith('.mdx') || item.endsWith('md')) {
        return `${contentFolder}/${item}`;
      }
      return undefined;
    });
    const filter1 = fileArr.filter((el) => el);
    // validate found paths
    const cwd = process.cwd();
    const validatedArr = await Promise.all(
      filter1.map(async (pathStr) => {
        try {
          await access(path.resolve(path.join(cwd, pathStr!)));
          return pathStr;
        } catch (err) {
          console.error(err);
        }
      }),
    );

    const finalArr = validatedArr.filter((el) => el);

    debug && console.log(finalArr);

    if (isNonEmptyArrayOfStrings(finalArr)) return finalArr;
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
  }
};

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
  if (!pathsArr) return;

  try {
    const cwd = process.cwd();

    const newimageEmbedPath = async ({
      fmatter,
      mdxPath,
    }: {
      fmatter: Record<string, unknown>;
      mdxPath: string;
    }): Promise<string | undefined> => {
      if (imageKey && typeof imageKey === 'string' && imageKey in fmatter) {
        debug && console.log('found hero image with key', imageKey);

        const imageType = 'type' in fmatter && (fmatter.type as string);

        const currentImagePath = fmatter[imageKey];

        if (typeof currentImagePath !== 'string') return;

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

        const publicCopyPath = `/public/${publicPath}/${imageType ? `${imageType}/` : `/`}${mdxFileSlug}/${currentImagePath.split('/').pop()}`;

        //console.log(publicCopyPath)

        const embedPublicCopyPath = `/${publicPath}/${imageType ? `${imageType}/` : `/`}${mdxFileSlug}/${currentImagePath.split('/').pop()}`;
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
          debug && console.log('image not in public folder, copying ...');
          //await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile);
        } else if (constPublicImgFile.size !== imgFile.size) {
          debug && console.log('found image is different from public folder, copying ...');
          //await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile);
        } else {
          debug && console.log('image is the same, not copying');
        }

        return embedPublicCopyPath;
      }
    };

    const imgMetaPlusBlurryPlaiceHolders = async ({
      fmatter,
      mdxPath,
    }: {
      fmatter: Record<string, unknown>;
      mdxPath: string;
    }) => {
      if (imageKey && imageKey in fmatter) {
        debug && console.log(`using ${fmatter[imageKey] as string} to generate img data + blurs`);
        const currentImagePath = fmatter[imageKey];
        const splitStr = mdxPath.split('/');
        const parentPath = splitStr.slice(0, splitStr.length - 1).join('/');
        const imgToCopyFilePath = path.resolve(parentPath, currentImagePath as string);

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

    const comboImageProcessing = async ({
      fmatter,
      mdxPath,
    }: {
      fmatter: Record<string, unknown>;
      mdxPath: string;
    }) => {
      if (imageKey && imageKey in fmatter) {
        // need to do this first (the other function seems to mutate something)
        const imgBlurPlusMetaRes = await imgMetaPlusBlurryPlaiceHolders({ fmatter, mdxPath });
        const imgBlurData = imgBlurPlusMetaRes?.base64;
        const imgHeight = imgBlurPlusMetaRes?.height;
        const imgWidth = imgBlurPlusMetaRes?.width;

        const newImgPath = await newimageEmbedPath({ fmatter, mdxPath });
        fmatter[imageKey] = newImgPath;
        return { ...fmatter, imgBlur: imgBlurData, imgHeight, imgWidth };
      }
    };
    const getInjectionPoint = (fileArr: string[], strOfInterest: string, precisionPoint: number) => {
      const getPoint = fileArr.map((strLine, index): number | undefined => {
        // we're going to look for the first "---" of the front matter
        // then inject. We can test that we're not adding at the end by
        // checking if the key following injection is valid
        const keyGuess = fileArr[index + precisionPoint]?.split(':')[0];
        const point = index + precisionPoint;
        if (strLine === strOfInterest && keyGuess) {
          debug && console.log('inject at ', point, 'before ', keyGuess);

          return point;
        }
        return undefined;
      });
      const injectionPoint = getPoint.filter((el) => el)[0];
      return injectionPoint;
    };

    const injectUUID = async ({ rawFile, absFilePath }: { rawFile: string; absFilePath: string }) => {
      const uuid = crypto.randomUUID();
      const fileArr = rawFile.split('\n');

      // we need to search the file string to find out where
      // we can safely inject the uuid.

      const injectionPoint = getInjectionPoint(fileArr, '---', 1);

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

    const injectSlug = async ({ rawFile, absFilePath }: { rawFile: string; absFilePath: string }) => {
      const fileWritePath = absFilePath;
      const fileName = fileWritePath.split('/').pop();
      if (!fileName) return;
      const slug = fileName.split('.')[0];
      const fileArr = rawFile.split('\n');

      
      // assuming we have the id, we'll inject it right after
      const injectionPoint = getInjectionPoint(fileArr, 'id', 1);

      if (typeof injectionPoint !== 'number') return;
      fileArr.splice(injectionPoint, 0, `slug: ${slug}`);

      const finalString = fileArr.join('\n');


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
        if (!('id' in frontMatter)) {
          debug && console.log('no uuid found, injecting...');
          const newMatter = await injectUUID({ absFilePath, rawFile });

          if (!newMatter) return;

          if (imageKey && imageKey in newMatter) {
            debug && console.log(`found ${newMatter[imageKey]}, processing image, updating injected matter...`);
            const finalMatter = await comboImageProcessing({ fmatter: newMatter, mdxPath });
            return finalMatter;
          }

          debug && console.log(`no image in front matter, returning injected`);
          return newMatter;
        }

        if (!('slug' in frontMatter)) {
          debug && console.log('no slug found, injecting...');
          const newMatter = await injectSlug({ absFilePath, rawFile });

          if (!newMatter) return;

          if (imageKey && imageKey in newMatter) {
            debug && console.log(`found ${newMatter[imageKey]}, processing image, updating injected matter...`);
            const finalMatter = await comboImageProcessing({ fmatter: newMatter, mdxPath });
            return finalMatter;
          }

          debug && console.log(`no image in front matter, returning injected`);
          return newMatter;
        }

        debug && console.log(`uuid found in front matter with ${frontMatter.id}, not injecting`);

        if (imageKey && imageKey in frontMatter) {
          debug && console.log(`found ${frontMatter[imageKey]}, processing image...`);
          const newMatter = await comboImageProcessing({ fmatter: frontMatter, mdxPath });
          return newMatter;
        }

        return frontMatter;
      }),
    );

    return matterMeta;
  } catch (err) {
    !suppressErr && console.error(err);
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
