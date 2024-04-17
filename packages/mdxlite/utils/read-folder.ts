import { opendir } from "node:fs/promises"
import matter from 'gray-matter'

export const blogPostFinder = async (searchFolder: string) => {
  const openDirRes = [];
  try {
    const dir = await opendir(searchFolder, { recursive: true });
    for await (const dirent of dir) {
      const fileName = dirent.name;
      const fileExt = dirent.name.split('.')[1];
      if (fileExt === 'mdx' || fileExt === 'md') {
        openDirRes.push(`${dirent.path}/${fileName}`);
      }
    }
    const fileArr = await Promise.all(
      openDirRes.map(async (mdxFilePath) => {
        const blob = Bun.file(mdxFilePath);
        const str = blob.toString()
        const fileObj = {
          meta: matter(str).data,
          content: matter(str).content,
          rawStr: str,
        };
        return fileObj;
      }),
    );
    return fileArr;
  } catch (err) {
    console.error(err);
  }
};

