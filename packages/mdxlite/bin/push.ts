#! /usr/bin/env bun
import { parseArgs } from "util";
import path from "node:path";
import { readdir } from "node:fs/promises";
import { blogPostFinder } from "../utils/read-folder";

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

const currentDir = process.cwd();
const searchFolder = path.resolve(currentDir, values.content!);

async function getPostPathsFromContentFolder(contentFolder: string) {
  const testDir = await readdir(contentFolder, {
    recursive: true,
  });

  const newArr = await Promise.all(testDir.map(async (item) => {
    const itemSplit = item.split("/");
    const lastItem = itemSplit.pop();
    const fileExt = lastItem?.split(".")[1];
    if (fileExt === "mdx" || fileExt === "md") {
      return item;
    }
  }))
  // need to purge undefined items
  const finalArr = newArr.filter(el => el);
  return finalArr
}


console.log(await getPostPathsFromContentFolder(searchFolder));
