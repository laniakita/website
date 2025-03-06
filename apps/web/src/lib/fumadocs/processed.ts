import { blog, blogFeed, categories, tags, } from '$/.source';

export const allPostsRes = await Promise.all(
  blog.map(async (post) => {
    
    const categoriesRes =
      post.catSlugs &&
      ((
        await Promise.all(
          post.catSlugs.map(async (ref) => {
            const found = categories.find((cat) => cat.slug === ref);
            if (found) {
              return {
                title: found.title,
                slug: found.slug,
                url: found.url,
                type: found.type,
              };
            }
          }),
        )
      )
        .filter((el) => el)
        .sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) as { title: string; url: string; type: string }[]);

    if (categoriesRes) {
      post.categories = categoriesRes;
      delete post.catSlugs;
    }

    const tagsRes =
      post.tagSlugs &&
      ((
        await Promise.all(
          post.tagSlugs.map(async (ref) => {
            const foundTags = tags.find((tag) => tag.slug === ref);
            if (foundTags) {
              return {
                title: foundTags.title,
                slug: foundTags.slug,
                url: foundTags.url,
                type: foundTags.type,
              };
            }
          }),
        )
      )
        .filter((el) => el)
        .sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) as { title: string; url: string; type: string }[]);

    if (tagsRes) {
      post.tags = tagsRes;
      delete post.tagSlugs;
    }

    return post;
  }),
);

export const allPostsFeedRes = await Promise.all(
  blogFeed.map(async (post) => {
    /*
    const config = {
      imageSrc: post.imageSrc ?? '',
      altText: post.altText ?? '',
      caption: post.caption ?? '',
    };

    const featured_image = await featuredImgRes('posts', post._file.path, config);
    post.featured_image = { ...featured_image };
    */

    const categoriesRes =
      post.catSlugs &&
      ((
        await Promise.all(
          post.catSlugs.map(async (ref) => {
            const found = categories.find((cat) => cat.slug === ref);
            if (found) {
              return {
                title: found.title,
                slug: found.slug,
                url: found.url,
                type: found.type,
              };
            }
          }),
        )
      )
        .filter((el) => el)
        .sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) as { title: string; url: string; type: string }[]);

    if (categoriesRes) {
      post.categories = categoriesRes;
      delete post.catSlugs;
    }

    const tagsRes =
      post.tagSlugs &&
      ((
        await Promise.all(
          post.tagSlugs.map(async (ref) => {
            const foundTags = tags.find((tag) => tag.slug === ref);
            if (foundTags) {
              return {
                title: foundTags.title,
                slug: foundTags.slug,
                url: foundTags.url,
                type: foundTags.type,
              };
            }
          }),
        )
      )
        .filter((el) => el)
        .sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) as { title: string; url: string; type: string }[]);

    if (tagsRes) {
      post.tags = tagsRes;
      delete post.tagSlugs;
    }

    return post;
  }),
);
