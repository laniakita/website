#! /usr/bin/env bun
import { parseArgs } from "util";
import path from "node:path";
import { readdir } from "node:fs/promises";
import matter from "gray-matter";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    content: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

console.log(values);
console.log(positionals);

/* phase 0: get local folder to read */

const currentDir = process.cwd();
const searchFolder = path.resolve(currentDir, values.content!);

/* phase 1: process local folder and get paths of MD & MDX files */

// readdir version of blogPostFinder(), opendir with bun doesn't seem to support recursion yet
async function getMDXPathsFromContentFolder(contentFolder: string) {
  const testDir = await readdir(contentFolder, {
    recursive: true,
  });

  const newArr = await Promise.all(
    testDir.map(async (item) => {
      const itemSplit = item.split("/");
      const lastItem = itemSplit.pop();
      const fileExt = lastItem?.split(".")[1];
      if (fileExt === "mdx" || fileExt === "md") {
        return item;
      }
    }),
  );

  // need to purge undefined items
  const finalArr = newArr.filter((el) => el);
  return finalArr;
}

//console.log(await getMDXPathsFromContentFolder(searchFolder));

/* phase 2: with file paths, we can send them into a database */

async function batchMdxProcessor(dataArr: string[]) {
  const fileArr = await Promise.all(
    dataArr.map(async (mdxFilePath: string) => {
      const blob = Bun.file(mdxFilePath);
      const str = blob.toString();
      const fileObj = {
        meta: matter(str).data,
        rawStr: str,
      };
      return fileObj;
    }),
  );
  return fileArr;
}

/* phase 3: combine! */

async function getPosts(contentFolder: string) {
  const pathsArr = await getMDXPathsFromContentFolder(contentFolder)
  const mdxArr = await batchMdxProcessor(pathsArr as string[])
  return mdxArr
}

console.log(await getPosts(searchFolder))
