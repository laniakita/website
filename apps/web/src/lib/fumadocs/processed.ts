import { blog, categories, tags } from "$/.source";
import { compareDesc } from "date-fns";
import { FeaturedImageR1, imageProcessor } from "../image-process";

const allPostsRes = await Promise.all(blog.map(async (post) => {

  const config = {
    imageSrc: post.imageSrc ?? '',
    altText: post.altText ?? '',
    caption: post.caption ?? ''
  }

  const featured_image = await featuredImgRes('posts', post._file.path, config);
  post.featured_image = { ...featured_image }

  const categoriesRes =
    post.catSlugs &&
    (await Promise.all(
      post.catSlugs.map(async (ref) => {
        const found = categories.find((cat) => cat.slug === ref);
        if (found) {
          return {
            title: found.title,
            url: found.url,
            type: found.type,
          };
        }
      }),
    ))
      .filter(el => el)
      .sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) as { title: string; url: string; type: string; }[];

  if (categoriesRes) {
    post.categories = categoriesRes;
    delete post.catSlugs;
  }

  const tagsRes =
    post.tagSlugs &&
    (await Promise.all(
      post.tagSlugs.map(async (ref) => {
        const foundTags = tags.find((tag) => tag.slug === ref);
        if (foundTags) {
          return {
            title: foundTags.title,
            url: foundTags.url,
            type: foundTags.type,
          };
        }
      }),
    ))
      .filter(el => el)
      .sort((a, b) => a?.title.localeCompare(b?.title ?? '') ?? 0) as { title: string; url: string; type: string; }[];

  if (tagsRes) {
    post.tags = tagsRes;
    delete post.tagSlugs;
  }

  return post
}));

export const allPosts = allPostsRes.sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));

async function featuredImgRes (collection: string, path: string, { imageSrc, altText, caption }: { imageSrc: string, altText: string, caption: string }) {
  const imgData = await imageProcessor({
    contentDir: 'content',
    prefix: `content/${collection}/${path}`,
    imgPath: imageSrc,
    debug: false,
  })

  const res = imgData ? new FeaturedImageR1(
    true,
    imgData.src,
    imgData.base64,
    imgData.height,
    imgData.width,
    imgData.resized,
    altText ?? '',
    caption ?? '',
    imgData._debug ?? null,
  ) : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

  return res

}
