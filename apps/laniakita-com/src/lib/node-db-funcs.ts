import { eq, desc, like, or, and } from 'drizzle-orm';
import { maindb } from '@/lib/db/drizzle';
import { authors } from '@/lib/db/schema/authors';
import { tags } from '@/lib/db/schema/tags';
import { posts } from '@/lib/db/schema/posts';
import { featuredImages } from '@/lib/db/schema/featured-images';
import matter from 'gray-matter';

export const descriptionHelper = (rawStr: string) => {
  const postDescContent = matter(rawStr).content
  
  const findDescr = postDescContent.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara;
    }
    return undefined;
  });
  return findDescr
}

export interface PostsToTagsItem {
  tag: {
    slug: string;
    title: string;
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
  }[];
}

export const queryPostMetas = async () => {
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
    const tags = post?.postToTags?.map((tags) => {
      const slug = tags?.tag?.slug;
      const title = tags?.tag?.title;

      return {slug: slug, title: title}
    });
    const tagTitle = post?.postToTags?.map((tags) => {
      const title = tags?.tag?.title;

      return title;
    });
    delete (post as unknown as {postToTags: Record<string, unknown> | undefined}).postToTags;
    return { ...post, tags: tags };
  });
  //console.dir(postRes, { depth: null });
  return finalRes;
};

export const queryPostByIdForJustRawStr = async (idStr: string) => {
  console.log(idStr) 
  const res = await maindb.query.posts.findFirst({
    where: eq(posts.id, idStr),
    columns: {
      rawStr: true,
    },
  });
  return res;
};

export const queryPostByIdandSlugOrJustId = async (idStr: string, slugStr: string) => {
  const postRes = await maindb.query.posts.findFirst({
    where: or(and(like(posts.id, `${idStr}%`), eq(posts.slug, slugStr)), like(posts.id, `${idStr}%`)),
    columns: {
      authorId: false,
      featuredImageId: false,
      rawStr: true,
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
            },
          },
        },
      },
      featuredImage: {
        columns: {
          fileLocation: true,
          blur: true,
          height: true,
          width: true,
        },
      },
    },
  });
  //console.dir(postRes, { depth: null });
  return postRes;
};
