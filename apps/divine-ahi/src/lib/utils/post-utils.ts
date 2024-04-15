import path from 'node:path';
import { readFile, access, opendir } from 'node:fs/promises';
import matter from 'gray-matter';



export const readMDXFile = async (folder: string, slug: string) => {
  const filePath = path.resolve(path.join(folder, `${slug}.mdx`));

  try {
    await access(filePath);
  } catch (err) {
    return null;
  }

  const fileContent = await readFile(filePath, { encoding: 'utf8' });
  return fileContent;
};

export const readIMGFile = async (folder: string, name: string) => {
  const imgFilePath = path.resolve(path.join(folder, name));

  try {
    await access(imgFilePath);
  } catch (err) {
    return null;
  }

  const fileContent = await readFile(imgFilePath);
  return fileContent;
};

export interface FrontMatterDataObject {
  slug?: string;
  headline?: string;
  subheadline?: string;
  author?: string;
  category?: string;
  date?: string;
  heroImage?: string;
  heroImageCreditName?: string;
  heroImageCreditLinkText?: string;
  heroImageCreditLinkUrl?: string;
  heroAltText?: string;
}

export const blogPostFinder = async (searchFolder: string) => {
  const dataArr: FrontMatterDataObject[] = [];
  try {
    const dir = await opendir(searchFolder);
    for await (const dirent of dir) {
      const str = await readFile(`${searchFolder}/${dirent.name}`, { encoding: 'utf8' });
      dataArr.push(matter(str).data as FrontMatterDataObject);
    }
    const finalDataArr = dataArr.sort((a, b) => (a.date! < b.date! ? 1 : -1));
    return { finalDataArr };
  } catch (err) {
    console.error(err);
  }
};


