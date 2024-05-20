#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { parseArgs } from 'node:util';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import type { HandlePostProps, HandleAuthorProps, HandleCategoryProps } from '@/utils/bun-mdx-sqlite-main';
import { handlePost, handleAuthor, handleCategory } from '@/utils/bun-mdx-sqlite-main';

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    content: {
      type: 'string',
    },
    debug: {
      type: 'boolean',
      short: 'd'
    }
  },
  strict: false,
  allowPositionals: true,
});

/* phase 0: get local folder to read */

const currentDir = process.cwd();
const searchFolder = path.resolve(currentDir, values.content as string);
const contentFolderName = values.content as string;
const debug = values.debug ? values.debug : false;

if (debug) {
  //const schemas = path.resolve(currentDir, values.schemas!);
}

/* phase 1: process local folder and get paths of MD & MDX files */

// readdir version of blogPostFinder(), opendir with bun doesn't seem to support recursion yet
async function getMDXPathsFromContentFolder(contentFolder: string) {
  const testDir = await readdir(contentFolder, {
    recursive: true,
  });

  const newArr = testDir.map((item): string | undefined => {
    const itemSplit = item.split('/');
    const lastItem = itemSplit.pop();
    const fileExt = lastItem?.split('.')[1];
    if (fileExt === 'mdx' || fileExt === 'md') {
      return `${contentFolder}/${item}`;
    }
    return undefined;
  });

  // need to purge undefined items
  const finalArr = newArr.filter((el) => el);
  return finalArr;
}

//console.log(await getMDXPathsFromContentFolder(searchFolder));

/* phase 2: with file paths, we can send them into a database */

async function batchMdxProcessor(absPathArr: string[]) {
  const getContentFolder = contentFolderName;
  const fileArr = await Promise.all(
    absPathArr.map(async (mdxFilePath: string) => {
      const blob = Bun.file(mdxFilePath);
      const str = await blob.text();
      const frontmatter = matter(str).data;
      const splitStr = mdxFilePath.split('/');

      /*
       * This is a script which lets us find the path starting from the content folder,
       *  purging the process.cwd() from the mdxFilePath
       * */

      const getLocalKeyIndex = splitStr.map((str1: string) => {
        if (str1 === getContentFolder) {
          return splitStr.indexOf(str1);
        }
        return undefined;
      });
      const keyIndex = getLocalKeyIndex.filter((el) => el);
      const freshLocalKey = splitStr.slice(keyIndex[0], splitStr.length).join('/');

      /*
       * if we have images in the frontmatter we can copy them over to the public folder,
       * and save the path to the image starting from the public folder, in our db so Next
       * can find them.
       **/

      if (frontmatter.heroFile) {
        console.log('found hero image');
        const parentPath = splitStr.slice(0, splitStr.length - 1).join('/');
        const imgToCopyFilePath = path.resolve(parentPath, frontmatter.heroFile as string);
        const publicCopyPath = `/public/assets/hero-images/${(frontmatter.heroFile as string).split('/').pop()}`;
        const embedPublicCopyPath = `/assets/hero-images/${(frontmatter.heroFile as string).split('/').pop()}`;
        const pathToCheck = path.join(currentDir, publicCopyPath);
        const constPublicImgFile = Bun.file(pathToCheck);
        const imgFile = Bun.file(imgToCopyFilePath);

        /* If the file isn't in the public folder, then copy it. If an image already exists in the public folder, but the declared frontmatter image is different (diff in size), then replace it. */
        const checkImg = await constPublicImgFile.exists();

        if (!checkImg) {
          console.log('image not in public folder, copying ...');
          await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile);
        } else if (constPublicImgFile.size !== imgFile.size) {
          console.log('found image is different from public folder, copying ...');
          await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile);
        } else {
          console.log('image is the same, not copying');
        }

        frontmatter.heroFile = embedPublicCopyPath;
      }
      /* put it all together */
      const fileObj = {
        meta: frontmatter,
        localKey: freshLocalKey,
        rawStr: str,
      };

      return fileObj;
    }),
  );

  return fileArr;
}

/* phase 3: combine! */

async function getPosts(contentFolder: string) {
  const pathsArr = await getMDXPathsFromContentFolder(contentFolder);
  const mdxArr = await batchMdxProcessor(pathsArr as string[]);
  return mdxArr;
}

//console.log( await getPosts(searchFolder) )

export const insertFromRawIndexV2 = async (folderOfContent: string) => {
  const rawPostArr = await getPosts(folderOfContent);
  let stage2 = false;
  if (rawPostArr.length > 0) {
    console.log('init! insert authors and categories first');
    await Promise.all(
      rawPostArr.map(async (postObj) => {
        if (postObj.meta.type === 'authors') {
          await handleAuthor(postObj as unknown as HandleAuthorProps);
        }
        if (postObj.meta.type === 'category') {
          await handleCategory(postObj as unknown as HandleCategoryProps);
        }
      }),
    );
    stage2 = true;
    console.log('success!');
  }
  if (rawPostArr.length > 0 && stage2) {
    console.log('phase 1 complete, inserting posts');
    await Promise.all(
      rawPostArr.map(async (postObj) => {
        if (postObj.meta.type === 'post') {
          await handlePost(postObj as unknown as HandlePostProps);
        }
      }),
    );
    console.log('all done!');
  }
};

await insertFromRawIndexV2(searchFolder);