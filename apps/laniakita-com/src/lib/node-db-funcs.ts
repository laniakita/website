import { eq, desc, like, or, and } from 'drizzle-orm';
import { maindb } from '@/lib/db/drizzle';
import { type Authors, authors } from '@/lib/db/schema/authors';
import { type Tags, tags } from '@/lib/db/schema/tags';
import { type Posts, posts, postsToTags } from '@/lib/db/schema/posts';
import { type FeaturedImages, featuredImages } from '@/lib/db/schema/featured-images';

const getAuthorFromID = async (idStr: string) => {
  const authorRes = await maindb.query.authors.findFirst({
    where: eq(authors.id, idStr),
    columns: {
      name: true,
      slug: true,
    },
  });
  return authorRes;
};

const getTagsFromIds = async (idArr: string[]) => {
  const tagRes = Promise.all(
    idArr.map(async (tagId) => {
      const titleRes = await maindb.query.tags.findFirst({
        where: eq(tags.id, tagId),
        columns: {
          title: true,
          slug: true,
        },
      });
      return titleRes;
    }),
  );
  return tagRes;
};

const getImageFromID = async (idStr: string) => {
  const imageRes = await maindb.query.featuredImages.findFirst({
    where: eq(featuredImages.id, idStr),
    columns: {
      fileLocation: true,
    },
  });
  return imageRes?.fileLocation;
};

export const queryPostMetas = async () => {
  const postRes = maindb
    .select()
    .from(postsToTags)
    .leftJoin(posts, eq(postsToTags.postId, posts.id))
    .leftJoin(tags, eq(postsToTags.tagId, tags.id))
    .where(eq(posts.id, postsToTags.postId))
    .all();

  console.log(postRes)
  /*  
  const postsRes = await maindb.query.posts.findMany({
    columns: {
      rawStr: false,
    },
    orderBy: [desc(posts.date)],
  });

  const translatedRes = Promise.all(postsRes.map(async (post) => {
    const authorName = await getAuthorFromID(post.authorId);
    const imageLocation = await get
  }))

  return postsArr;
  */
};