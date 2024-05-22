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

interface ImageUtilProps {
  fmatter: Record<string, unknown>;
  mdxPath: string;
  publicPath?: string;
  imageKey: string;
  debug?: boolean;
}

const newimageEmbedPath = async ({
  fmatter,
  mdxPath,
  publicPath,
  imageKey,
  debug,
}: ImageUtilProps): Promise<string | undefined> => {
  if (imageKey && typeof imageKey === 'string' && imageKey in fmatter) {
    debug && console.log('found hero image with key', imageKey);

    const imageType = 'type' in fmatter && (fmatter.type as string);

    const currentImagePath = fmatter[imageKey];

    if (typeof currentImagePath !== 'string') return;

    //debug && console.log(currentImagePath)

    const splitStr = mdxPath.split('/');
    // need to get parent path before mutating array with pop.
    const parentPath = splitStr.slice(0, splitStr.length - 1).join('/');
    //debug && console.log(parentPath)

    // now we can get the mdx file name to use as the folder later.
    const mdxFile = splitStr.pop();
    if (!mdxFile) return;
    const mdxFileSlug = mdxFile.split('.')[0];
    //debug && console.log(mdxFileSlug)

    const imgToCopyFilePath = path.resolve(parentPath, currentImagePath);
    //debug && console.log(imgToCopyFilePath)

    const publicCopyPath = `/public/${publicPath}/${imageType ? `${imageType}/` : `/`}${mdxFileSlug}/${currentImagePath.split('/').pop()}`;

    //debug && console.log(publicCopyPath)

    const embedPublicCopyPath = `/${publicPath}/${imageType ? `${imageType}/` : `/`}${mdxFileSlug}/${currentImagePath.split('/').pop()}`;
    //debug && console.log(embedPublicCopyPath)

    const pathToCheck = path.join(process.cwd(), publicCopyPath);
    //debug && console.log(pathToCheck)
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

const imgMetaPlusBlurryPlaiceHolders = async ({ fmatter, mdxPath, imageKey, debug }: ImageUtilProps) => {
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

const comboImageProcessing = async ({ fmatter, mdxPath, imageKey, publicPath, debug }: ImageUtilProps) => {
  if (imageKey && imageKey in fmatter) {
    // need to do this first (the other function seems to mutate something)
    const imgBlurPlusMetaRes = await imgMetaPlusBlurryPlaiceHolders({ fmatter, mdxPath, imageKey, debug });
    const imgBlurData = imgBlurPlusMetaRes?.base64;
    const imgHeight = imgBlurPlusMetaRes?.height;
    const imgWidth = imgBlurPlusMetaRes?.width;

    const newImgPath = await newimageEmbedPath({ fmatter, mdxPath, imageKey, publicPath, debug });
    fmatter[imageKey] = newImgPath;
    return { ...fmatter, imgBlur: imgBlurData, imgHeight, imgWidth };
  }
};

interface InjectionPointProps {
  fileArr: string[];
  strOfInterest: string;
  precisionPoint: number;
  debug?: boolean;
}

const getInjectionPoint = ({ fileArr, strOfInterest, precisionPoint, debug }: InjectionPointProps) => {
  const getPoint = fileArr.map((strLine, index): number | undefined => {
    // we're going to look for the first "---" of the front matter
    // then inject. We can test that we're not adding at the end by
    // checking if the key following injection is valid
    const keyGuess = fileArr[index + precisionPoint]?.split(':')[0];
    //console.log(keyGuess)
    //console.log(strLine.split(':')[0])
    const point = index + precisionPoint;
    if (strLine === strOfInterest && keyGuess) {
      debug && console.log('inject at ', index + precisionPoint, 'before ', keyGuess);

      return point;
    } else if (strLine.split(':')[0] === strOfInterest) {
      debug && console.log('found', strOfInterest, 'at', index, 'Injecting at', point, 'before', keyGuess);
      return point;
    }
    return undefined;
  });
  const injectionPoint = getPoint.filter((el) => el)[0];
  return injectionPoint;
};

interface InjectionProps {
  rawFile: string;
  absFilePath: string;
  debug?: boolean;
}

const injectUUID = async ({ rawFile, absFilePath, debug }: InjectionProps) => {
  const uuid = crypto.randomUUID();
  const fileArr = rawFile.split('\n');

  // we need to search the file string to find out where
  // we can safely inject the uuid.

  const injectionPoint = getInjectionPoint({ fileArr, strOfInterest: '---', precisionPoint: 1, debug });

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

const injectSlug = async ({ rawFile, absFilePath, debug }: InjectionProps) => {
  const fileArr = rawFile.split('\n');

  const fileWritePath = absFilePath;
  console.log(fileWritePath);
  const fileName = fileWritePath.split('/').pop();
  console.log(fileName);
  if (!fileName) return;
  const slug = fileName.split('.')[0];

  // assuming we have the id, we'll inject it right after
  const injectionPoint = getInjectionPoint({ fileArr, strOfInterest: 'id', precisionPoint: 1, debug });

  if (typeof injectionPoint !== 'number') return;
  fileArr.splice(injectionPoint, 0, `slug: ${slug}`);

  const finalString = fileArr.join('\n');

  debug && console.log(`saving updated markdown file to `, fileWritePath);

  await Bun.write(fileWritePath, finalString);
  const newMatter = matter(finalString).data;

  // we'll need to update the image path in memory, if it exists

  return newMatter;
};

const comboInject = async ({ rawFile, absFilePath, debug }: InjectionProps) => {
  const uuid = crypto.randomUUID();
  const fileArr = rawFile.split('\n');

  const fileWritePath = absFilePath;
  console.log(fileWritePath);
  const fileName = fileWritePath.split('/').pop();
  console.log(fileName);
  if (!fileName) return;
  const slug = fileName.split('.')[0];

  // we need to search the file string to find out where
  // we can safely inject the uuid.

  const injectionPointId = getInjectionPoint({ fileArr, strOfInterest: '---', precisionPoint: 1, debug });

  if (typeof injectionPointId !== 'number') return;
  fileArr.splice(injectionPointId, 0, `id: ${uuid}`);

  // i think we can just feed the current filarArr, can't we?
  // assuming we have the id, we'll inject it right after
  const injectionPointSlug = getInjectionPoint({ fileArr, strOfInterest: 'id', precisionPoint: 1, debug });

  if (typeof injectionPointSlug !== 'number') return;
  fileArr.splice(injectionPointSlug, 0, `slug: ${slug}`);

  debug && console.log(`saving updated markdown file to `, fileWritePath);
  const finalString = fileArr.join('\n');

  await Bun.write(fileWritePath, finalString);
  const newMatter = matter(finalString).data;

  return newMatter;
};

interface MatterProcessorProps {
  frontMatter: Record<string, unknown>;
  absFilePath: string;
  mdxPath: string;
  rawFile: string;
  imageKey?: string;
  publicPath?: string;
  debug?: boolean;
}

const matterProcessor = async ({
  frontMatter,
  absFilePath,
  mdxPath,
  rawFile,
  imageKey,
  publicPath,
  debug,
}: MatterProcessorProps): Promise<Record<string, unknown> | undefined> => {
  // I've made the DRY Principle sadge. I'm sorry.
  if (!('id' in frontMatter) && !('slug' in frontMatter)) {
    debug && console.log('no uuid or slug found, injecting...');
    const newMatter = await comboInject({ absFilePath, rawFile, debug });

    if (!newMatter) return;

    const finalPass = await matterProcessor({
      frontMatter: newMatter,
      absFilePath,
      mdxPath,
      rawFile,
      imageKey,
      publicPath,
      debug,
    });

    return finalPass;
  }

  if (!('id' in frontMatter)) {
    debug && console.log('no uuid found, injecting...');
    const newMatter = await injectUUID({ absFilePath, rawFile, debug });

    if (!newMatter) return;

    const finalPass = await matterProcessor({
      frontMatter: newMatter,
      absFilePath,
      mdxPath,
      rawFile,
      imageKey,
      publicPath,
      debug,
    });

    return finalPass;
  } else if (!('slug' in frontMatter)) {
    debug && console.log('no slug found, injecting...');
    const newMatter = await injectSlug({ absFilePath, rawFile });

    if (!newMatter) return;

    const finalPass = await matterProcessor({
      frontMatter: newMatter,
      absFilePath,
      mdxPath,
      rawFile,
      imageKey,
      publicPath,
      debug,
    });

    return finalPass;
  } else if (imageKey && imageKey in frontMatter) {
    debug && console.log(`uuid found in front matter with ${frontMatter.id}, not injecting`);
    debug && console.log(`slug found in front matter with ${frontMatter.slug}, not injecting`);
    debug && console.log(`found ${frontMatter[imageKey]}, processing image...`);
    const newMatter = await comboImageProcessing({ fmatter: frontMatter, mdxPath, imageKey, publicPath, debug });
    return newMatter;
  }

  return frontMatter;
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
  const cwd = process.cwd();
  try {
    const metaArr = await Promise.all(
      pathsArr.map(async (mdxPath: string) => {
        const absFilePath = path.resolve(path.join(cwd, mdxPath));
        const readIntoMem = Bun.file(absFilePath);
        const rawFile = await readIntoMem.text();
        const frontMatter = matter(rawFile).data;
        const res = await matterProcessor({ frontMatter, absFilePath, mdxPath, rawFile, imageKey, publicPath, debug });
        return res;
      }),
    );
    return metaArr;
  } catch (err) {
    suppressErr && console.error(err);
  }
};

export const batchFetchMain = async (fetchConfig: ConfigProps & BatchFetchFrontMatterProps) => {
  const validMdxPaths = await batchFetchMDXPaths(fetchConfig);
  const frontMatterArr = await batchFetchFrontMatter({
    ...fetchConfig,
    pathsArr: validMdxPaths!,
    imageKey: fetchConfig.imageKey,
    publicPath: fetchConfig.publicPath,
  });
  fetchConfig.debug && console.log(frontMatterArr);
  return frontMatterArr;
};
