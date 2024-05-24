/* eslint-disable no-console -- we're not in the browser, so this is fine. */
import { eq } from 'drizzle-orm';
import { maindb } from '@/lib/db/bun-db';
import { type Authors, authors } from '@/lib/db/schema/authors';
import { type Tags, tags } from '@/lib/db/schema/tags';
import { type Posts, posts } from './db/schema/posts';
import { type FeaturedImages, featuredImages } from './db/schema/featured-images';

export async function insertAuthors(data: Authors) {
  if (!data.id) {
    console.error('no author id! did you forget something?');
    return;
  }
  const authorData = data;

  await maindb
    .insert(authors)
    .values({
      id: authorData.id,
      slug: authorData.slug,
      date: authorData.date.toString(),
      name: authorData.name,
      mastodon: authorData.mastodon,
      rawStr: authorData.rawStr,
    })
    .onConflictDoUpdate({
      target: authors.id,
      set: {
        slug: authorData.slug,
        date: authorData.date.toString(),
        name: authorData.name,
        mastodon: authorData.mastodon,
        rawStr: authorData.rawStr,
      },
    });
  console.log('inserted', authorData.name, 'into db');
}

export async function insertTags(data: Tags) {
  if (!data.id) {
    console.error('no tag id! did you forget something?');
    return;
  }
  const tagData = data;

  await maindb
    .insert(tags)
    .values({
      id: tagData.id,
      slug: tagData.slug,
      date: tagData.date.toString(),
      title: tagData.title,
      rawStr: tagData.rawStr,
    })
    .onConflictDoUpdate({
      target: tags.id,
      set: { slug: tagData.slug, date: tagData.date.toString(), title: tagData.title, rawStr: tagData.rawStr },
    });

  console.log('inserted', tagData.title, 'into db');
}

export async function insertFeaturedImages(data: FeaturedImages) {
  if (!data.id) {
    console.error('no image id! did you forget something?');
    return;
  }
  const imgData = data;

  await maindb
    .insert(featuredImages)
    .values({
      id: imgData.id,
      slug: imgData.slug,
      date: imgData.date.toString(),
      fileLocation: imgData.fileLocation,
      caption: imgData.caption,
      credit: imgData.credit,
      creditUrlText: imgData.creditUrlText,
      creditUrl: imgData.creditUrl,
      altText: imgData.altText,
      blur: imgData.blur,
      height: imgData.height,
      width: imgData.width,
    })
    .onConflictDoUpdate({
      target: featuredImages.id,
      set: {
        slug: imgData.slug,
        date: imgData.date.toString(),
        fileLocation: imgData.fileLocation,
        caption: imgData.caption,
        credit: imgData.credit,
        creditUrlText: imgData.creditUrlText,
        creditUrl: imgData.creditUrl,
        altText: imgData.altText,
        blur: imgData.blur,
        height: imgData.height,
        width: imgData.width,
      },
    });

  console.log('inserted', imgData.slug, 'into db');
}

export async function getTagIDBySlug(slug: string): Promise<{ id: string } | undefined> {
  const res = await maindb.query.tags.findFirst({
    where: eq(tags.slug, slug),
    columns: {
      id: true,
    },
  });
  return res;
}

export async function insertPosts(data: Posts) {
  if (!data.id) {
    console.error('no post id! Did you forget something?');
    return;
  }
  const postData = data;
  const tagIdRes = await Promise.all(
    postData.tags.map(async (iTag) => {
      const res = await getTagIDBySlug(iTag);
      if (!(res && 'id' in res)) return;
      return res.id;
    }),
  );
  console.log(tagIdRes)
  /*
  await maindb.insert(posts).values({
    id: postData.id,
    authorId: postData.id,
    slug: postData.slug,
    date: postData.date,
    headline: postData.headline,
    subheadline: postData.subheadline,
    featuredImageId: postData.featuredImageId
  });
  */
}
