#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { parseArgs } from 'node:util';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import type { HandlePostProps, HandleAuthorProps, HandleCategoryProps } from '@/lib/utils/mdxlite-bun';
import { handlePost, handleAuthor, handleCategory } from '@/lib/utils/mdxlite-bun';

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    content: {
      type: 'string',
    },
    //schemas: {
    //  type: "string",
    //},
  },
  strict: true,
  allowPositionals: true,
});

console.log(values);
console.log(positionals);

/* phase 0: get local folder to read */

const currentDir = process.cwd();
const searchFolder = path.resolve(currentDir, values.content!);

//const schemas = path.resolve(currentDir, values.schemas!);

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
  const fileArr = await Promise.all(
    absPathArr.map(async (mdxFilePath: string) => {
      const blob = Bun.file(mdxFilePath);
      const str = await blob.text();
      const frontmatter = matter(str).data;
      if (frontmatter.heroFile) {
        const splitStr = mdxFilePath.split('/');
        const parentPath = splitStr.slice(0, splitStr.length - 1).join('/');
        const imgToCopyFilePath = path.resolve(parentPath, frontmatter.heroFile as string);
        const publicCopyPath = `/public/assets/hero-images/${splitStr.pop()!.split('.')[0]}/${(frontmatter.heroFile as string).split('/').pop()}` 
        const imgFile = Bun.file(imgToCopyFilePath)
        await Bun.write(`${process.cwd()}${publicCopyPath}`, imgFile)

        frontmatter.heroFile = publicCopyPath
      }
      const fileObj = {
        meta: frontmatter,
        rawStr: str,
      };
      console.log(fileObj)
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

/* ======= V3 Work in Progess: DO NOT USE ======== */

/* phase: needs work : get drizzle config + schemas */
/*
async function getSchemas(schemasPath: string) {
  // todo case of single schema.ts, instead of assuming folder of schemas
  const testDir = await readdir(schemasPath, {
    recursive: true,
  });

  const newArr = await Promise.all(
    testDir.map(async (item) => {
      const itemSplit = item.split('/');
      const lastItem = itemSplit.pop();
      const fileExt = lastItem?.split('.')[1];
      if (fileExt === 'ts') {
        return `${schemasPath}/${item}`;
      }
    }),
  );

  // need to purge undefined items
  const finalArr = newArr.filter((el) => el);
  return finalArr;
}
*/

//console.log(await getSchemas(schemas))

/*
async function importFromSchemas(schemasPath: string) {
  // assumes filename is exported module
  const schemaArr = await getSchemas(schemasPath);
  const schemasInArr = await Promise.all(
    schemaArr.map(async (item: string) => {
      let schemaName = item.split("/").pop()!.split('.')[0]
      //console.log(schemaName)
      //const schema = await import(item as string).then((mod) => mod.schemaName);
      //console.log(schema)
    }),
  );
}
*/
//await importFromSchemas(schemas);
