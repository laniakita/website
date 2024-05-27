/* eslint-disable-next-line import/named -- monorepo issues */
import { cache } from 'react';
import 'server-only';
import { eq, desc, like, or, and } from 'drizzle-orm';
import { maindb } from '@/lib/db/turso-db';
import { posts, postsToTags } from '@/lib/db/schema/posts';
import { tags } from '@/lib/db/schema/tags';

//import { maindb } from '@/lib/db/drizzle';


export interface PostsToTagsItem {
  tag: {
    slug: string;
    title: string;
    id: string;
  };
}

export interface QueryPostMetaItem {
  id: string;
  date: Date;
  slug: string;
  headline: string;
  subheadline: string;
  author: {
    name: string;
  };
  featuredImage?: {
    fileLocation: string;
    altText: string;
    blur: string;
    height: number;
    width: number;
  };
  tags: {
    slug: string;
    title: string;
    id: string;
  }[];
  localKey: string;
}

export interface QueryPost extends QueryPostMetaItem {
  rawStr: string;
}

export const queryPostMetas = cache(async () => {
  const postRes = await maindb.query.posts.findMany({
    orderBy: [desc(posts.date)],
    columns: {
      authorId: false,
      featuredImageId: false,
      rawStr: false,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
      postToTags: {
        columns: {
          tagId: false,
          postId: false,
        },
        with: {
          tag: {
            columns: {
              slug: true,
              title: true,
              id: true,
            },
          },
        },
      },
      featuredImage: {
        columns: {
          fileLocation: true,
          altText: true,
          blur: true,
          height: true,
          width: true,
        },
      },
    },
  });
  const finalRes = postRes.map((post) => {
    const tagsOne = post.postToTags.map((tagsObj) => {
      const slug = tagsObj.tag.slug;
      const title = tagsObj.tag.title;
      const id = tagsObj.tag.id;

      return { slug, title, id };
    });
    delete (post as unknown as { postToTags: Record<string, unknown> | undefined }).postToTags;
    return { ...post, tags: tagsOne };
  });
  //console.dir(finalRes, { depth: null });
  return finalRes;
});

export const queryPostByIdForJustRawStr = cache(async (idStr: string) => {
  const resOne = await maindb.query.posts.findFirst({
    where: eq(posts.id, idStr),
    columns: {
      rawStr: true,
    },
  });
  return resOne;
});

export const queryPostByIdandSlugOrJustIdForJustRawStr = cache(async ({
  idStr,
  slugStr,
}: {
  idStr: string;
  slugStr: string;
}) => {
  const postRes = await maindb.query.posts.findFirst({
    where: or(and(like(posts.id, `${idStr}%`), eq(posts.slug, slugStr)), like(posts.id, `${idStr}%`)),
    columns: {
      rawStr: true,
    },
  });
  return postRes;
});

export interface PostQ extends QueryPostMetaItem {
  featuredImage: {
    fileLocation: string;
    altText: string;
    credit?: string;
    creditUrl?: string;
    creditUrlText?: string;
    caption?: string;
    height: number;
    width: number;
    blur: string;
  };
  altCaption?: string;
  rawStr: string;
}

export const queryPostMetaByIdandSlugOrJustId = cache(async ({ idStr, slugStr }: { idStr: string; slugStr: string }) => {
  const postRes = await maindb.query.posts.findFirst({
    where: or(
      and(like(posts.id, `${idStr}%`), eq(posts.slug, slugStr)),
      or(like(posts.id, `${idStr}%`), eq(posts.id, idStr)),
    ),
    columns: {
      authorId: false,
      featuredImageId: false,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
      postToTags: {
        columns: {
          tagId: false,
          postId: false,
        },
        with: {
          tag: {
            columns: {
              slug: true,
              title: true,
              id: true,
            },
          },
        },
      },
      featuredImage: {
        columns: {
          fileLocation: true,
          altText: true,
          credit: true,
          creditUrl: true,
          creditUrlText: true,
          caption: true,
          blur: true,
          height: true,
          width: true,
        },
      },
    },
  });

  if (!postRes) return;

  const tagsMap = postRes.postToTags.map((tagsObj) => {
    const slug = tagsObj.tag.slug;
    const title = tagsObj.tag.title;
    const id = tagsObj.tag.id;
    return { slug, title, id };
  });

  delete (postRes as unknown as { postToTags: Record<string, unknown> | undefined }).postToTags;

  return { ...postRes, tags: tagsMap };
});

/*
    where: or(
      or(
        and(like(posts.id, `${idStr}%`), eq(posts.slug, slugStr)),
        or(like(posts.id, `${idStr}%`), eq(posts.id, idStr)),
      ),
      and(eq(posts.id, idStr), eq(posts.slug, slugStr)),
    ),
*/

export interface TagQ {
  id: string;
  slug: string;
  date: string;
  title: string;
  localKey: string;
  rawStr: string;
}

export const getAllTags = cache(async () => {
  const res = await maindb.select().from(tags);
  return res;
});

export const getTag = cache(async ({ idStr, slugStr }: { idStr: string; slugStr: string }) => {
  const idRes2 = await maindb.query.tags.findFirst({
    where: or(and(like(tags.id, `${idStr}%`), eq(tags.slug, slugStr)), like(tags.id, `${idStr}%`)),
  });
  return idRes2;
});

// type of metaItem arr
export const getPostsWithTagID = cache(async (tagIdStr: string) => {
  const idRes = await maindb.query.tags.findFirst({
    where: like(tags.id, `${tagIdStr}%`),
    columns: {
      id: true,
    },
  });

  if (!idRes?.id) return;

  const queryRes = await maindb.query.postsToTags.findMany({
    where: eq(postsToTags.tagId, idRes.id),
    columns: {
      postId: false,
      tagId: false,
    },
    with: {
      post: {
        columns: {
          id: true,
          slug: true,
        },
      },
    },
  });

  const postRes = await Promise.all(
    queryRes.map(async (post) => {
      const innerRes = await queryPostMetaByIdandSlugOrJustId({ idStr: post.post.id, slugStr: post.post.slug });
      return innerRes;
    }),
  );

  return postRes;
});
