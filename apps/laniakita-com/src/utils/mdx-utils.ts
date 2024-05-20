import { opendir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

// types
export interface WorkMetaProps {
  title: string;
  slug: string;
  date: Date;
  updated?: Date;
  type?: string;
  teaserImg?: string;
  teaserAlt?: string;
  descr: string;
  tech: string[];
  status: string;
  blurUrl?: string;
}

export interface PostTeaserObjectProps {
  type: string;
  uuid: string;
  slug: string;
  'category-slug'?: string;
  headline: string;
  subheadline?: string;
  author: string;
  date: string;
  heroFile?: string;
  heroCaption?: string;
  heroCredit?: string;
  heroCreditUrl?: string;
  heroCreditUrlText?: string;
  heroAltText?: string;
  blurUrl?: string;
}

// fyi: opendir works, but not recursively on Bun (unless that's been fixed). ignore this if on node.
// builds an array of post locations
export const fetchMDXfiles = async (inputFolder: string) => {
  const fileArr: string[] = [];
  try {
    const contentFolder = path.resolve(process.cwd(), inputFolder);
    const dir = await opendir(contentFolder, { recursive: true });
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

// fetches frontmatter from a given path
export const fetchFrontmatter = async (pathStr: string) => {
  try {
    const content = await readFile(pathStr, { encoding: 'utf8' });
    const matterData = matter(content).data;
    return matterData;
  } catch (err) {
    console.error(err);
    return {};
  }
};

// fetches frontmatter from an entire folder
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
      return b.date - a.date;
    });
    return sortedMetas;
  } catch (err) {
    console.error(err);
  }
};

// fetches frontmatter if type matches
export const batchMatterFetchByType = async (inputFolder: string, matterType: string, resToMatch: string) => {
  const resFetchAll = await batchMatterFetch(inputFolder);
  if (!resFetchAll) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
  const matchArr = resFetchAll.map((post: any) => {
    //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- generic function
    if (post[matterType] === resToMatch) {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-return -- generic function
      return post;
    }
    return undefined;
  });
  const finalArr = matchArr.filter((el) => el);

  //eslint-disable-next-line @typescript-eslint/no-unsafe-return -- generic function
  return finalArr;
};

// gets all mdx paths from a folder, and returns the post as a string
const matchMDXFile = async (inputFolder: string, slug: string) => {
  const altContent = await fetchMDXfiles(inputFolder);
  const findPostPath = altContent.map((mdxPath) => {
    if (`${slug}.mdx` === mdxPath.split('/').pop() || `${slug}.md` === mdxPath.split('/').pop()) {
      return mdxPath;
    }
    return undefined;
  });
  const finalPath = findPostPath.filter((el) => el);
  //console.log(finalPath);
  if (typeof finalPath[0] !== 'string') return;
  const foundContent = await readFile(finalPath[0], { encoding: 'utf-8' });
  return foundContent;
};

// finds mdx from a folder with a slug, and alternatively recursively searches
// the folder for any nested posts that match the slug, and returns the string
export const fetchMdx = async (inputFolder: string, slug: string) => {
  const pathStr = path.resolve(process.cwd(), inputFolder, `${slug}.mdx`);
  try {
    let exists = false;
    try {
      await access(pathStr);
      exists = true;
    } catch {
      exists = false;
    }
    if (exists) {
      const content = await readFile(pathStr, { encoding: 'utf8' });
      return content;
    }
    const secondTry = await matchMDXFile(inputFolder, slug);
    return secondTry;
  } catch (e) {
    console.error(e);
  }
};

// finds the given path of a mdx file, from an input folder and a slug
const matchMDXFilePath = async (inputFolder: string, slug: string) => {
  const altContent = await fetchMDXfiles(inputFolder);
  const findPostPath = altContent.map((mdxPath) => {
    if (`${slug}.mdx` === mdxPath.split('/').pop() || `${slug}.md` === mdxPath.split('/').pop()) {
      return mdxPath;
    }
    return undefined;
  });
  const finalPath = findPostPath.filter((el) => el);
  if (typeof finalPath[0] !== 'string') return;
  //const foundContent = await readFile(finalPath[0], { encoding: 'utf-8' });
  return finalPath[0];
};

// combo function that first searches the first level of a input folder with
// a given slug. Then searches deeper levels for the post with the slug. On
//match of either, it returns the file path.
export const fetchMdxPath = async (inputFolder: string, slug: string) => {
  const pathStr = path.resolve(process.cwd(), inputFolder, `${slug}.mdx`);
  try {
    let exists = false;
    try {
      await access(pathStr);
      exists = true;
    } catch {
      exists = false;
    }
    if (exists) {
      return pathStr;
    }
    const secondTry = await matchMDXFilePath(inputFolder, slug);
    return secondTry;
  } catch (e) {
    console.error(e);
  }
};
