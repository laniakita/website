#! /usr/bin/env bun
import { mkdir } from 'node:fs/promises';
import { allPosts } from 'contentlayer/generated';
import { postHtml } from '@/lib/html/mdx-html-wrapper';

const allPostsRes = await Promise.all(allPosts.map(async (doc) => {
  console.log(`trying to turn ${doc.headline} into html`)
  const html = await postHtml(doc);
  return {...doc, html}
}));


export const writeWithHtmlContent = async () => {
  const t0 = performance.now();
  console.info(`Creating ${allPosts.length} minified posts...`);

  try {
    const postsPlusHtml = allPostsRes;

    const mainDir = './.contentlayerplushtml/generated';
    const mainOut = 'index.json';

    const postDir = `${mainDir}/Post`;

    await mkdir(postDir, { recursive: true });

    await Bun.write(`${postDir}/${mainOut}`, JSON.stringify(postsPlusHtml));

    const t1 = performance.now();
    const tDelta = `${t1 - t0} ms`;

    console.info(`[SUCCESS]: wrote ${allPosts.length} posts with HTML to ${postDir}/${mainOut} in ${tDelta}`);

  } catch (err) {
    console.error(err);
  }
};
