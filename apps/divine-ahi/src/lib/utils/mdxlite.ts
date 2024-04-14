import { opendir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { eq, and, or, sql } from 'drizzle-orm';
import type { Authors } from '@/lib/mdxlite/schema/authors';
import { authors } from '@/lib/mdxlite/schema/authors';
import { categories } from '@/lib/mdxlite/schema/categories';
import mdxlitedb from '@/lib/mdxlite/drizzle';
import { posts } from '../mdxlite/schema/posts';

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
        const str = await readFile(mdxFilePath, { encoding: 'utf8' });
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

export const insertFromRawIndex = async (searchFolder: string) => {
  const rawPostArr = await blogPostFinder(searchFolder);
  if (rawPostArr) {
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
  }
};

interface HandleAuthorProps {
  meta: { name: string; mastodon?: string };
  content: string;
}

const handleAuthor = async (postObj: HandleAuthorProps) => {
  console.log('found author file');
  // check if postObj.meta.name == authors.name
  const checkRes = await mdxlitedb
    .select({
      testId: authors.id,
      testName: authors.name,
    })
    .from(authors)
    .where(eq(authors.name, postObj.meta.name));
  if (checkRes.length > 0) {
    console.log('author exists trying update');
    // @ts-expect-error -- types exist because how else could checkRes have a length > 0?
    const { testId, testName } = checkRes[0];
    console.log(`exists with ${testId as string}`);
    console.log(`exists with ${testName as string}`);
    await mdxlitedb
      .update(authors)
      .set({
        name: postObj.meta.name,
        mastodon: postObj.meta.mastodon,
        bio: postObj.content,
      })
      .where(and(eq(authors.id, testId as number), eq(authors.name, testName as string)));
  }
  // insert into db
  if (checkRes.length === 0) {
    console.log("author doesn't exist, inserting into authors table");
    await mdxlitedb
      .insert(authors)
      .values({
        name: postObj.meta.name,
        mastodon: postObj.meta.mastodon,
        bio: postObj.content,
      })
      .onConflictDoNothing();
  }
};

interface HandleCategoryProps {
  meta: { title: string };
  content: string;
}

const handleCategory = async (postObj: HandleCategoryProps) => {
  console.log('found category file');
  // check if postObj.meta.name == authors.name
  const checkRes = await mdxlitedb
    .select({
      testId: categories.id,
      testName: categories.title,
    })
    .from(categories)
    .where(eq(categories.title, postObj.meta.title));
  if (checkRes.length > 0) {
    console.log('category info file exists trying update');
    // @ts-expect-error -- types exist because how else could checkRes have a length > 0?
    const { testId, testName } = checkRes[0];
    console.log(`exists with ${testId as string}`);
    console.log(`exists with ${testName as string}`);
    await mdxlitedb
      .update(categories)
      .set({
        title: postObj.meta.title,
        description: postObj.content,
      })
      .where(and(eq(categories.id, testId as number), eq(categories.title, testName as string)));
  }
  // insert into db
  if (checkRes.length === 0) {
    console.log("category doesn't exist, inserting into categories table");
    await mdxlitedb
      .insert(categories)
      .values({
        title: postObj.meta.title,
        description: postObj.content,
      })
      .onConflictDoNothing();
  }
};

interface HandlePostProps {
  meta: {
    headline: string;
    subheadline: string;
    author: string;
    category: string;
    date: string;
    heroFile: string;
    heroCredit: string;
    heroCreditUrlText: string;
    heroCreditUrl: string;
    heroAltText: string;
  };
  content: string;
}

const handlePostProps = async (postObj: HandlePostProps) => {
  console.log('found post file');
  // check if postObj.meta.name == authors.name
  const checkRes = await mdxlitedb
    .select({
      testId: posts.id,
      testHeadline: posts.headline,
      testAuthor: posts.author,
      testDate: posts.date,
    })
    .from(posts)
    .where(
      or(
        and(eq(posts.headline, postObj.meta.headline), eq(posts.author, postObj.meta.author)),
        and(eq(posts.date, postObj.meta.date), eq(posts.author, postObj.meta.author)),
      ),
    );

  if (checkRes.length > 0) {
    console.log('post file exists trying update');

    // @ts-expect-error -- types exist because how else could checkRes have a length > 0?
    const { testId, testHeadline, testDate, testAuthor } = checkRes[0];

    console.log(`exists with ${testId as string}`);
    console.log(`exists with ${testHeadline as string}`);
    console.log(`exists with ${testDate as string}`);

    await mdxlitedb
      .update(posts)
      .set({
        headline: postObj.meta.headline,
        subheadline: postObj.meta.subheadline,
        author: postObj.meta.author,
        category: postObj.meta.category,
        date: postObj.meta.date,
        heroFile: postObj.meta.heroFile,
        heroCredit: postObj.meta.heroCredit,
        heroCreditUrlText: postObj.meta.heroCreditUrlText,
        heroCreditUrl: postObj.meta.heroCreditUrl,
        heroAltText: postObj.meta.heroAltText,
        content: postObj.content,
      })
      .where(
        or(
          and(eq(posts.id, testId as number), eq(posts.author, testAuthor as string)),
          and(eq(posts.id, testId as number), eq(posts.date, testDate as string)),
        ),
      );
  }
  // insert into db
  if (checkRes.length === 0) {
    console.log("post doesn't exist, inserting into posts table");
    const authorQ = await mdxlitedb
      .select({ name: authors.name })
      .from(authors)
      .leftJoin(posts, eq(authors.name, postObj.meta.author));
    const categoryQ = await mdxlitedb
      .select({ title: categories.title })
      .from(categories)
      .leftJoin(posts, eq(categories.title, postObj.meta.category));
    
    await mdxlitedb
      .insert(posts)
      .values({
        headline: postObj.meta.headline,
        subheadline: postObj.meta.subheadline,
        author: authorQ as unknown as string,
        category: categoryQ as unknown as string,
        date: postObj.meta.date,
        heroFile: postObj.meta.heroFile,
        heroCredit: postObj.meta.heroCredit,
        heroCreditUrlText: postObj.meta.heroCreditUrlText,
        heroCreditUrl: postObj.meta.heroCreditUrl,
        heroAltText: postObj.meta.heroAltText,
        content: postObj.content,
      })
      .onConflictDoNothing();
  }
};
