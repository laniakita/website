/* eslint-disable no-console -- bun is bun */
import { eq, and, or } from 'drizzle-orm';
import { maindb } from '@/lib/db/bun-db';
import { authors } from '@/lib/db/schema/authors';
import { categories } from '@/lib/db/schema/categories';
import { posts } from '@/lib/db/schema/posts';

export interface HandleAuthorProps {
  meta: { name: string; mastodon?: string };
  rawStr: string;
  localKey?: string;
}

export const handleAuthor = async (postObj: HandleAuthorProps) => {
  console.log('found author file');
  // check if postObj.meta.name == authors.name
  const checkRes = await maindb
    .select({
      testId: authors.id,
      testName: authors.name,
    })
    .from(authors)
    .where(eq(authors.name, postObj.meta.name));
  if (checkRes.length > 0) {
    console.log('author exists trying update');
   
    const { testId, testName } = checkRes[0]!;
    console.log(`exists with ${testId}`);
    console.log(`exists with ${testName}`);
    await maindb
      .update(authors)
      .set({
        name: postObj.meta.name,
        mastodon: postObj.meta.mastodon,
        rawContent: postObj.rawStr,
        localKey: postObj.localKey,
      })
      .where(and(eq(authors.id, testId), eq(authors.name, testName!)));
  }
  // insert into db
  if (checkRes.length === 0) {
    console.log("author doesn't exist, inserting into authors table");
    await maindb
      .insert(authors)
      .values({
        id: crypto.randomUUID(),
        name: postObj.meta.name,
        mastodon: postObj.meta.mastodon,
        rawContent: postObj.rawStr,
        localKey: postObj.localKey,
      })
      .onConflictDoNothing();
  }
};

export interface HandleCategoryProps {
  meta: { title: string };
  content: string;
  rawStr: string;
  localKey?: string;
}

export const handleCategory = async (postObj: HandleCategoryProps) => {
  console.log('found category file');
  // check if postObj.meta.name == authors.name
  const checkRes = await maindb
    .select({
      testId: categories.id,
      testName: categories.title,
    })
    .from(categories)
    .where(eq(categories.title, postObj.meta.title));
  if (checkRes.length > 0) {
    console.log('category info file exists trying update');
   
    const { testId, testName } = checkRes[0]!;
    console.log(`exists with ${testId}`);
    console.log(`exists with ${testName}`);
    await maindb
      .update(categories)
      .set({
        title: postObj.meta.title,
        rawContent: postObj.rawStr,
        localKey: postObj.localKey,
      })
      .where(and(eq(categories.id, testId), eq(categories.title, testName)));
  }
  // insert into db
  if (checkRes.length === 0) {
    console.log("category doesn't exist, inserting into categories table");
    await maindb
      .insert(categories)
      .values({
        id: crypto.randomUUID(),
        title: postObj.meta.title,
        rawContent: postObj.rawStr,
        localKey: postObj.localKey,
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
    heroCaption: string;
    heroCredit: string;
    heroCreditUrlText: string;
    heroCreditUrl: string;
    heroAltText: string;
  };
  rawStr: string;
  localKey?: string;
}

export const handlePost = async (postObj: HandlePostProps) => {
  console.log('found post');
  const authorQ = await maindb
    .select({ name: authors.name })
    .from(authors)
    .where(eq(authors.name, postObj.meta.author));
  const categoryQ = await maindb
    .select({ title: categories.title })
    .from(categories)
    .where(eq(categories.title, postObj.meta.category));

  const authorMatch = authorQ[0];
  const categoryMatch = categoryQ[0];
  const checkPostExists = await maindb
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
    console.log('author & category exists, inserting post');
    if (checkPostExists.length > 0) {
      console.log('post exists, updating...');
     
      const { testId, testHeadline, testDate } = checkPostExists[0]!;
      await maindb
        .update(posts)
        .set({
          authorName: postObj.meta.author,
          date: postObj.meta.date.toUTCString(),
          headline: postObj.meta.headline,
          subheadline: postObj.meta.subheadline,
          category: postObj.meta.category,
          heroFile: postObj.meta.heroFile,
          heroCaption: postObj.meta.heroCaption,
          heroCredit: postObj.meta.heroCredit,
          heroCreditUrlText: postObj.meta.heroCreditUrlText,
          heroCreditUrl: postObj.meta.heroCreditUrl,
          heroAltText: postObj.meta.heroAltText,
          rawContent: postObj.rawStr,
          localKey: postObj.localKey,
        })
        .where(
          or(
            and(eq(posts.id, testId), eq(posts.headline, testHeadline)),
            and(eq(posts.id, testId), eq(posts.date, testDate)),
          ),
        );
    }
    if (checkPostExists.length === 0) {
      console.log("post doesn't exist, inserting");

      await maindb.insert(posts).values({
        id: crypto.randomUUID(),
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
        localKey: postObj.localKey,
      });
    }
  }
};