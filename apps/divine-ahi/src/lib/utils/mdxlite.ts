import { opendir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import type { Post } from '@/lib/mdxlite/schema/post';
import { post } from '@/lib/mdxlite/schema/post';

export const blogPostFinder = async (searchFolder: string) => {
  const openDirRes = [];
  const fileArr = [];
  try {
    const dir = await opendir(searchFolder, { recursive: true });
    for await (const dirent of dir) {
      const fileName = dirent.name;
      const fileExt = dirent.name.split('.')[1];
      if (fileExt === 'mdx' || fileExt === 'md') {
        openDirRes.push(`${dirent.path}/${fileName}`)
      }
    }

    for await (const file of openDirRes) {
      const str = await readFile(file, {encoding: 'utf8'})
      const fileObj = {
        meta: matter(str).data,
        rawStr: str
      }
      fileArr.push(fileObj)
    }

    return fileArr;

    /*for await (const dirent of dir) {
      const str = await readFile(searchFolder + '/' + dirent.name, { encoding: 'utf8' });
      dataArr.push(matter(str).data as FrontMatterDataObject);
    }
    const finalDataArr = dataArr.sort((a, b) => (a.date! < b.date! ? 1 : -1));
    return { finalDataArr };
    */
  } catch (err) {
    console.error(err);
  }
};
