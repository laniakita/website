/* eslint-disable no-console -- bun is bun */
import { eq, and, or } from 'drizzle-orm';
import mdxlitedb from '@/lib/mdxlite/bun-db';
import { authors } from '@/lib/mdxlite/schema/authors';
import { categories } from '@/lib/mdxlite/schema/categories';
import { posts } from '@/lib/mdxlite/schema/posts';

export interface HandleAuthorProps {
  meta: { name: string; mastodon?: string };
  content: string;
}

export const handleAuthor = async (postObj: HandleAuthorProps) => {
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

export interface HandleCategoryProps {
  meta: { title: string };
  content: string;
  rawStr: string;
}

export const handleCategory = async (postObj: HandleCategoryProps) => {
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
        rawContent: postObj.rawStr
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
        rawContent: postObj.rawStr
      })
      .onConflictDoNothing();
  }
};

export interface HandlePostProps {
  meta: {
    author: string;
    date: Date;
    headline: string;
    subheadline: string;
    category: string;
    heroFile: string;
    heroCredit: string;
    heroCreditUrlText: string;
    heroCreditUrl: string;
    heroAltText: string;
  };
  rawStr: string;
}

export const handlePost = async (postObj: HandlePostProps) => {
  console.log('found post')
  const authorQ = await mdxlitedb
    .select({ name: authors.name })
    .from(authors)
    .where(eq(authors.name, postObj.meta.author));
  const categoryQ = await mdxlitedb
    .select({ title: categories.title })
    .from(categories)
    .where(eq(categories.title, postObj.meta.category));

  const authorMatch = authorQ[0];
  const categoryMatch = categoryQ[0];
  const checkPostExists = await mdxlitedb
    .select({
      testId: posts.id,
      testHeadline: posts.headline,
      testDate: posts.date,
    })
    .from(posts)
    .where(
      or(
        and(eq(posts.headline, postObj.meta.headline), eq(posts.date, postObj.meta.date.toUTCString())),
        eq(posts.date, postObj.meta.date.toUTCString()),
      ),
    );

  if (typeof authorMatch?.name === 'string' && typeof categoryMatch?.title === 'string') {
    console.log('author & category exists, inserting post')
    if (checkPostExists.length > 0) {
      console.log('post exists, updating...')
      // @ts-expect-error -- types exist because how else could checkPostExists have a length > 0?
      const { testId, testHeadline, testDate } = checkPostExists[0];
      await mdxlitedb
        .update(posts)
        .set({
          authorName: postObj.meta.author,
          date: postObj.meta.date.toUTCString(),
          headline: postObj.meta.headline,
          subheadline: postObj.meta.subheadline,
          category: postObj.meta.category,
          heroFile: postObj.meta.heroFile,
          heroCredit: postObj.meta.heroCredit,
          heroCreditUrlText: postObj.meta.heroCreditUrlText,
          heroCreditUrl: postObj.meta.heroCreditUrl,
          heroAltText: postObj.meta.heroAltText,
          rawContent: postObj.rawStr,
        })
        .where(
          or(
            and(eq(posts.id, testId as number), eq(posts.headline, testHeadline as string)),
            and(eq(posts.id, testId as number), eq(posts.date, testDate as string)),
          ),
        );
    }
    if (checkPostExists.length === 0) {
      console.log("post doesn't exist, inserting")
      await mdxlitedb.insert(posts).values({
        authorName: postObj.meta.author,
        date: postObj.meta.date.toUTCString(),
        headline: postObj.meta.headline,
        subheadline: postObj.meta.subheadline,
        category: postObj.meta.category,
        heroFile: postObj.meta.heroFile,
        heroCredit: postObj.meta.heroCredit,
        heroCreditUrlText: postObj.meta.heroCreditUrlText,
        heroCreditUrl: postObj.meta.heroCreditUrl,
        heroAltText: postObj.meta.heroAltText,
        rawContent: postObj.rawStr,
      });
    }
  }
};
