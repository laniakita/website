import { eq, desc, like, or, and } from 'drizzle-orm';
import { maindb } from '@/lib/db/bun-db';
import { categories } from '@/lib/db/schema/categories';
import { posts } from '@/lib/db/schema/posts';

export const querySinglePost = async (searchId: string, searchSlug: string) => {
  const postRes = await maindb.query.posts.findFirst({
    where: or(and(like(posts.id, `${searchId}%`), eq(posts.headline, searchSlug)), like(posts.id, `${searchId}%`)),
  });
  return postRes;
};

export const queryCategoryDescr = async (searchTitle: string) => {
  const catDescr = await maindb.query.categories.findFirst({
    where: eq(categories.title, searchTitle),
  });
  return catDescr;
};

export const queryPostsByCategory = async (category: string) => {
  const postsInCategory = await maindb.query.posts.findMany({
    where: eq(posts.category, category),
    orderBy: [desc(posts.date)],
  });
  return postsInCategory;
};

export const queryPosts = async () => {
  const postsArr = await maindb.query.posts.findMany({
    orderBy: [desc(posts.date)],
  });

  return postsArr;
};

export const queryPostMetas = async () => {
  const postsArr = await maindb.query.posts.findMany({
    columns: {
      rawContent: false,
    },
    orderBy: [desc(posts.date)],
  });

  return postsArr;
};

export const queryCategoryMetas = async () => {
  const categoryArr = await maindb.query.categories.findMany({
    columns: {
      rawContent: false,
    },
  });

  return categoryArr;
};