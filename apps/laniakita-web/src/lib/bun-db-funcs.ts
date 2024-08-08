/* eslint-disable no-console -- we're not in the browser, so this is fine. */
import { eq, and } from 'drizzle-orm';
//import { maindb } from '@/lib/db/bun-db';
import { maindb } from '@/lib/db/turso-db';
import { type Authors, authors } from '@/lib/db/schema/authors';
import { type Tags, tags } from '@/lib/db/schema/tags';
import { type Posts, posts, postsToTags } from '@/lib/db/schema/posts';
import { type FeaturedImages, featuredImages } from '@/lib/db/schema/featured-images';

export const insertAuthors = async (data: Authors): Promise<void> => {
  if (!data.id) {
    console.error('no author id! did you forget something?');
    return;
  }
  try {
    const authorData = data;
    console.log(authorData);

    // perform check should update
    const inserted = await maindb.query.authors.findFirst({
      where: eq(authors.id, authorData.id),
      columns: {
        id: true,
        slug: true,
        date: true,
        name: true,
        mastodon: true,
        mastodonURL: true,
        localKey: true,
        rawStr: true,
      },
    });

    const assembledData = {
      id: authorData.id,
      slug: authorData.slug,
      date: authorData.date,
      name: authorData.name,
      mastodon: authorData.mastodon,
      mastodonURL: authorData.mastodonURL,
      localKey: authorData.localKey,
      rawStr: authorData.rawStr,
    };

    if (JSON.stringify(assembledData) !== JSON.stringify(inserted)) {
      await maindb
        .insert(authors)
        .values(assembledData)
        .onConflictDoUpdate({
          target: authors.id,
          set: {
            slug: authorData.slug,
            date: authorData.date,
            name: authorData.name,
            mastodon: authorData.mastodon,
            mastodonURL: authorData.mastodonURL,
            localKey: authorData.localKey,
            rawStr: authorData.rawStr,
          },
        });
      console.log('inserted', authorData.name, 'into db');
    } else {
      console.log('author', authorData.name, 'already exists');
    }
  } catch (err) {
    console.error("Couldn't insert author:", err);
  }
};

export const insertTags = async (data: Tags): Promise<void> => {
  if (!data.id) {
    console.error('no tag id! did you forget something?');
    return;
  }
  try {
    const tagData = data;

    const inserted = await maindb.query.tags.findFirst({
      where: eq(tags.id, tagData.id),
      columns: {
        id: true,
        slug: true,
        date: true,
        title: true,
        localKey: true,
        rawStr: true,
      },
    });

    const assembledData = {
      id: tagData.id,
      slug: tagData.slug,
      date: tagData.date,
      title: tagData.title,
      localKey: tagData.localKey,
      rawStr: tagData.rawStr,
    };

    if (JSON.stringify(assembledData) !== JSON.stringify(inserted)) {
      await maindb
        .insert(tags)
        .values(assembledData)
        .onConflictDoUpdate({
          target: tags.id,
          set: {
            slug: tagData.slug,
            date: tagData.date,
            title: tagData.title,
            localKey: tagData.localKey,
            rawStr: tagData.rawStr,
          },
        });

      console.log('inserted', tagData.title, 'into db');
    } else {
      console.log('tag', tagData.title, 'already exists');
    }
  } catch (err) {
    console.error("Couldn't insert tags", err);
  }
};

export const insertFeaturedImages = async (data: FeaturedImages): Promise<void> => {
  if (!data.id) {
    console.error('no image id! did you forget something?');
    return;
  }
  try {
    const imgData = data;

    const inserted = await maindb.query.featuredImages.findFirst({
      where: eq(featuredImages.id, imgData.id),
      columns: {
        id: true,
        slug: true,
        date: true,
        fileLocation: true,
        caption: true,
        credit: true,
        creditUrlText: true,
        creditUrl: true,
        altText: true,
        localKey: true,
        blur: true,
        height: true,
        width: true,
        rawStr: true,
      },
    });

    const assembledData = {
      id: imgData.id,
      slug: imgData.slug,
      date: imgData.date,
      fileLocation: imgData.fileLocation,
      caption: imgData.caption,
      credit: imgData.credit ? imgData.credit : null,
      creditUrlText: imgData.creditUrlText ? imgData.credit : null,
      creditUrl: imgData.creditUrl ? imgData.creditUrl : null,
      altText: imgData.altText,
      localKey: imgData.localKey,
      blur: imgData.blur,
      height: imgData.height,
      width: imgData.width,
      rawStr: imgData.rawStr,
    };

    if (JSON.stringify(assembledData) !== JSON.stringify(inserted)) {
      await maindb
        .insert(featuredImages)
        .values(assembledData)
        .onConflictDoUpdate({
          target: featuredImages.id,
          set: {
            slug: imgData.slug,
            date: imgData.date,
            fileLocation: imgData.fileLocation,
            caption: imgData.caption,
            credit: imgData.credit,
            creditUrlText: imgData.creditUrlText,
            creditUrl: imgData.creditUrl,
            altText: imgData.altText,
            localKey: imgData.localKey,
            blur: imgData.blur,
            height: imgData.height,
            width: imgData.width,
            rawStr: imgData.rawStr,
          },
        });

      console.log('inserted', imgData.slug, 'into db');
    } else {
      console.log('img', imgData.slug, 'already exists');
    }
  } catch (err) {
    console.error("Couldn't insert images:", err);
  }
};

export const insertPosts = async (data: Posts): Promise<void> => {
  if (!data.id) {
    console.error('no post id! Did you forget something?');
    return;
  }
  try {
    const postData = data;

    // sleep a second
    console.log('let data load');
    const sleep = (ms: number) =>
      new Promise((r) => {
        setTimeout(r, ms);
      });
    await sleep(500);
    console.log("okay! let's continue");

    /*
  if (!(featuredImageIdRes && 'id' in featuredImageIdRes)) {
    console.error('Could not retrieve image id from slug! Did you forget something?');
    return;
  }


  if (!(authorIdRes && 'id' in authorIdRes)) {
    console.error('Could not retrieve author id from slug! Did you forget something?');
    return;
  }
*/
    const getAuthorID = async (slugStr: string) => {
      const authorIdRes = await maindb.query.authors.findFirst({
        where: eq(authors.slug, slugStr),
        columns: {
          id: true,
        },
      });
      return authorIdRes;
    };
    const getImgId = async (slugStr: string) => {
      const featuredImageIdRes = await maindb.query.featuredImages.findFirst({
        where: eq(featuredImages.slug, slugStr),
        columns: {
          id: true,
        },
      });
      return featuredImageIdRes;
    };

    const inserted = await maindb.query.posts.findFirst({
      where: eq(posts.id, postData.id),
      columns: {
        id: true,
        authorId: true,
        slug: true,
        date: true,
        headline: true,
        subheadline: true,
        featuredImageId: true,
        altCaption: true,
        localKey: true,
        rawStr: true,
      },
    });

    const authorIdfuncRes = await getAuthorID(postData.author);
    const imgIdfuncRes = await getImgId(postData.featuredImage);

    const assembledData = {
      id: postData.id,
      authorId: authorIdfuncRes!.id,
      slug: postData.slug,
      date: postData.date,
      headline: postData.headline,
      subheadline: postData.subheadline,
      featuredImageId: imgIdfuncRes!.id,
      altCaption: postData.altCaption ? postData.altCaption : null,
      localKey: postData.localKey,
      rawStr: postData.rawStr,
    };

    if (JSON.stringify(assembledData) !== JSON.stringify(inserted)) {
      await maindb
        .insert(posts)
        .values(assembledData)
        .onConflictDoUpdate({
          target: posts.id,
          set: {
            authorId: authorIdfuncRes?.id,
            slug: postData.slug,
            date: postData.date,
            headline: postData.headline,
            subheadline: postData.subheadline,
            featuredImageId: imgIdfuncRes?.id,
            altCaption: postData.altCaption,
            localKey: postData.localKey,
            rawStr: postData.rawStr,
          },
        });
      console.log('inserted', postData.slug, 'into db');
    } else {
      console.log('post', postData.slug, 'already exists');
    }

    await Promise.all(
      postData.tags.map(async (tagSlug) => {
        const res = await maindb.query.tags.findFirst({
          where: eq(tags.slug, tagSlug),
          columns: {
            id: true,
          },
        });
        if (!(res && 'id' in res)) return;

        const insertedPostToTags = await maindb.query.postsToTags.findFirst({
          where: and(eq(postsToTags.tagId, res.id), eq(postsToTags.postId, postData.id)),
          columns: {
            tagId: true,
            postId: true,
          },
        });

        const assembledDataPostToTags = {
          tagId: res.id,
          postId: postData.id,
        };

        if (JSON.stringify(assembledDataPostToTags) !== JSON.stringify(insertedPostToTags)) {
          await maindb
            .insert(postsToTags)
            .values(assembledDataPostToTags)
            .onConflictDoUpdate({
              target: [postsToTags.postId, postsToTags.tagId],
              set: { postId: postData.id, tagId: res.id },
            });
          console.log('associated', tagSlug, 'with', postData.slug, 'in db');
        } else {
          console.log(
            tagSlug,
            'with id:',
            res.id,
            'is already associated with \npost:',
            postData.slug,
            'with id',
            postData.id,
          );
        }
      }),
    );
    console.log('all done!');
  } catch (err) {
    console.error("Couldn't insert posts", err);
  }
};
