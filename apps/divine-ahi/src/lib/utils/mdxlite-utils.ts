// for use with next's node environement
import { eq, desc } from 'drizzle-orm';
import mdxlitedb from '@/lib/mdxlite/drizzle';
import { categories } from '@/lib/mdxlite/schema/categories';
import { posts } from '@/lib/mdxlite/schema/posts';

export const querySinglePost = async (searchHeadline: string) => {
  const postRes = await mdxlitedb.query.posts.findFirst({
    where: eq(posts.headline, searchHeadline)
  })
  return postRes
}
 
export const queryCategoryDescr = async (searchTitle: string) => {
  const catDescr = await mdxlitedb.query.categories.findFirst({
    where: eq(categories.title, searchTitle)
  });
  return catDescr
}

export const queryPostsByCategory = async(category: string) => {
  const postsInCategory = await mdxlitedb.query.posts.findMany({
    where: eq(posts.category, category),
    orderBy: [desc(posts.date)],
  })
  return postsInCategory
}

export const queryPosts = async () => {
  const postsArr = await mdxlitedb.query.posts.findMany({
    orderBy: [desc(posts.date)],
  });

  return postsArr;
};

export const queryPostMetas = async () => {
  const postsArr = await mdxlitedb.query.posts.findMany({
    columns: {
      rawContent: false,
    },
    orderBy: [desc(posts.date)],
  });

  return postsArr;
};


