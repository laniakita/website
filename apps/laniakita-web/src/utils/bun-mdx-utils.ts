/* eslint-disable no-undef -- bun is bun */
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export const fetchMDXfilesBun = async (inputFolder: string): Promise<(string | undefined)[]> => {
  try {
    const contentFolder = path.resolve(process.cwd(), inputFolder);
    const dir = await readdir(contentFolder, { recursive: true });
    const fileArr = dir.map((item) => {
      const itemSplit = item.split('/');
      const lastItem = itemSplit.pop();
      const fileExt = lastItem?.split('.')[1];
      if (fileExt === 'mdx' || fileExt === 'md') {
        return `${contentFolder}/${item}`;
      }
      return undefined;
    });
    const finalArr = fileArr.filter((el) => el);
    return finalArr;
  } catch (err) {
    console.error(err);
    return [''];
  }
};

export const batchMatterFetchBun = async (inputFolder: string) => {
  try {
    const fetchPathRaw = await fetchMDXfilesBun(inputFolder);
    const fetchPaths = fetchPathRaw as string[];
    const matterMeta = await Promise.all(
      fetchPaths.map(async (mdxPath: string) => {
        const metaObj = await fetchFrontmatterBun(mdxPath);
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

export const fetchFrontmatterBun = async (pathStr: string) => {
  try {
    const content = Bun.file(pathStr, { type: 'text/plain;charset=utf-8' });
    const matterData = matter(await content.text()).data;
    return matterData;
  } catch (err) {
    console.error(err);
    return {};
  }
};
