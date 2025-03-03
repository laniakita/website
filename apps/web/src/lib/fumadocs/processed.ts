import { blog, blogFeed, categories, projects, tags, works } from '$/.source';
import { FeaturedImageR1, imageProcessor } from '../image-process';

export const allProjectsRes = await Promise.all(
  projects.map(async (project) => {
    const config = {
      imageSrc: project.imageSrc ?? '',
      altText: project.altText ?? '',
      caption: '',
    };

    const featured_image = await featuredImgRes('projects', project._file.path, config);
    project.featured_image = { ...featured_image };

    return project;
  }),
);

export const allWorksRes = await Promise.all(
  works.map(async (work) => {
    const config = {
      imageSrc: work.imageSrc ?? '',
      altText: work.altText ?? '',
      caption: '',
    };

    const featured_image = await featuredImgRes('works', work._file.path, config);
    work.featured_image = { ...featured_image };

    return work;
  }),
);

export const allPostsRes = await Promise.all(
  blog.map(async (post) => {
    const config = {
      imageSrc: post.imageSrc ?? '',
      altText: post.altText ?? '',
      caption: post.caption ?? '',
    };

    const featured_image = await featuredImgRes('posts', post._file.path, config);
    post.featured_image = { ...featured_image };

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
    const config = {
      imageSrc: post.imageSrc ?? '',
      altText: post.altText ?? '',
      caption: post.caption ?? '',
    };

    const featured_image = await featuredImgRes('posts', post._file.path, config);
    post.featured_image = { ...featured_image };

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

async function featuredImgRes(
  collection: string,
  path: string,
  { imageSrc, altText, caption }: { imageSrc: string; altText: string; caption: string },
) {
  const imgData = await imageProcessor({
    contentDir: 'content',
    prefix: `content/${collection}/${path}`,
    imgPath: imageSrc,
    debug: false,
  });

  const res = imgData
    ? new FeaturedImageR1(
        true,
        imgData.src,
        imgData.base64,
        imgData.height,
        imgData.width,
        imgData.resized,
        altText ?? '',
        caption ?? '',
        imgData._debug ?? null,
      )
    : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

  return res;
}
