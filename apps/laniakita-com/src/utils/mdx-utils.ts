import { opendir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

// fyi: opendir works, but not recursively on Bun (unless that's been fixed). ignore this if on node.
export const fetchMDXfiles = async (inputFolder: string) => {
  const fileArr: string[] = [];
  try {
    const contentFolder = path.resolve(process.cwd(), inputFolder);
    const dir = await opendir(contentFolder);
    for await (const dirent of dir) {
      if (dirent.name.split('.').pop() === 'mdx' || dirent.name.split('.').pop() === 'md') {
        fileArr.push(path.resolve(dirent.path, dirent.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
  return fileArr;
};

export const fetchFrontmatter = async (pathStr: string) => {
  try {
    const content = await readFile(pathStr, { encoding: 'utf8' });
    const matterData = matter(content).data;
    return matterData;
  } catch (err) {
    console.error(err);
  }
};

export const batchMatterFetch = async (inputFolder: string) => {
  try {
    const fetchPaths = await fetchMDXfiles(inputFolder);
    const matterMeta = await Promise.all(
      fetchPaths.map(async (mdxPath: string) => {
        const metaObj = await fetchFrontmatter(mdxPath);
        return metaObj;
      }),
    );
    const sortedMetas = matterMeta.sort((a, b) => {
      return b?.date - a?.date;
    });
    return sortedMetas;
  } catch (err) {
    console.error(err);
  }
};

export const batchMatterFetchByType = async(inputFolder:string, matterType: string, resToMatch: string) => {
  const resFetchAll = await batchMatterFetch(inputFolder);
  if (!resFetchAll) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
  const matchArr = resFetchAll.map((post: any) => {
    //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- generic function
    if (post[matterType] === resToMatch) {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-return -- generic function
      return post
    }
    return undefined
  });
  const finalArr = matchArr.filter((el) => el);

  //eslint-disable-next-line @typescript-eslint/no-unsafe-return -- generic function
  return finalArr
}

export const fetchMdx = async (inputFolder: string, slug: string) => {
  const pathStr = path.resolve(process.cwd(), inputFolder, `${slug}.mdx`);
  try {
    const content = await readFile(pathStr, { encoding: 'utf8' });
    return content;
  } catch (err) {
    console.error(err);
  }
};
