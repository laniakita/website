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
        fileArr.push(path.resolve(dirent.path, dirent.name))   
      }
    }
  } catch (err) {
    console.error(err);
  }
  return fileArr
};

export const fetchFrontmatter = async (pathStr: string) => {
  try {
    const content = await readFile(pathStr, {encoding: 'utf8'});
    const matterData = matter(content).data
    return matterData
  } catch (err) {
    console.error(err)
  }
}

export const batchMatterFetch = async (inputFolder: string) => {
  try {
    const fetchPaths = await fetchMDXfiles(inputFolder)
    const matterMeta = await Promise.all(fetchPaths.map(async (mdxPath: string) => {
      const metaObj = await fetchFrontmatter(mdxPath)
      return metaObj
    }))
    return matterMeta
  } catch (err) {console.error(err)}
}
