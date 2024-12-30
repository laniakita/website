#! /usr/bin/env bun
import { mkdir } from 'node:fs/promises';
import { allPosts, allPages, allCategories, allTags, allProjects } from 'contentlayer/generated';

const allPostsRes = () => {
  return allPosts.map((doc) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- vars
    const { body, html, ...content } = doc;
    return content;
  });
};

const allPagesRes = () => {
  return allPages.map((doc) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- vars
    const { body, ...content } = doc;
    return content;
  });
};

const allCatsRes = () => {
  return allCategories.map((doc) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- vars
    const { body, ...content } = doc;
    return content;
  });
};

const allTagsRes = () => {
  return allTags.map((doc) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- vars
    const { body, ...content } = doc;
    return content;
  });
};

const allProjectsRes = () => {
  return allProjects.map((doc) => {
    const { ...content } = doc;
    return content;
  });
};

/*
const allWorksRes = () => {
  return allWorks.map((doc) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars -- vars
    const { body, ...content } = doc;
    return content;
  });
};
*/

export const writeMinifiedContent = async () => {
  const t0 = performance.now();
  console.info(`Creating ${allPosts.length} minified posts...`);
  console.info(`Creating ${allPages.length} minified pages...`);
  console.info(`Creating ${allCategories.length} minified categories...`);
  console.info(`Creating ${allTags.length} minified tags...`);
  console.info(`Creating ${allProjects.length} minified projects...`);
  //console.info(`Creating ${allWorks.length} minified tags...`);

  try {
    const postsMin = allPostsRes();
    const pagesMin = allPagesRes();
    const catsMin = allCatsRes();
    const tagsMin = allTagsRes();
    const projectsMin = allProjectsRes();
    //const worksMin = allWorksRes();

    const mainDir = './.contentlayermini/generated';
    const mainOut = 'index.json';

    const postDir = `${mainDir}/Post`;
    const pageDir = `${mainDir}/Page`;
    const catDir = `${mainDir}/Category`;
    const tagDir = `${mainDir}/Tag`;
    const projDir = `${mainDir}/Project`;
    //const workDir = `${mainDir}/Work`;

    await mkdir(postDir, { recursive: true });
    await mkdir(pageDir, { recursive: true });
    await mkdir(catDir, { recursive: true });
    await mkdir(tagDir, { recursive: true });
    await mkdir(projDir, { recursive: true });
    //await mkdir(workDir, { recursive: true });

    await Bun.write(`${postDir}/${mainOut}`, JSON.stringify(postsMin));
    await Bun.write(`${pageDir}/${mainOut}`, JSON.stringify(pagesMin));
    await Bun.write(`${catDir}/${mainOut}`, JSON.stringify(catsMin));
    await Bun.write(`${tagDir}/${mainOut}`, JSON.stringify(tagsMin));
    await Bun.write(`${projDir}/${mainOut}`, JSON.stringify(projectsMin));
    //await Bun.write(`${workDir}/${mainOut}`, JSON.stringify(worksMin));

    const t1 = performance.now();
    const tDelta = `${t1 - t0} ms`;

    console.info(`[SUCCESS]: wrote ${allPosts.length} mini posts to ${postDir}/${mainOut} in ${tDelta}`);
    console.info(`[SUCCESS]: wrote ${allPages.length} mini pages to ${pageDir}/${mainOut} in ${tDelta}`);
    console.info(`[SUCCESS]: wrote ${allCategories.length} mini categories to ${catDir}/${mainOut} in ${tDelta}`);
    console.info(`[SUCCESS]: wrote ${allTags.length} mini tags to ${tagDir}/${mainOut} in ${tDelta}`);
    console.info(`[SUCCESS]: wrote ${allProjects.length} mini projects to ${projDir}/${mainOut} in ${tDelta}`);
    //console.info(`[SUCCESS]: wrote ${allWorks.length} mini works to ${workDir}/${mainOut} in ${tDelta}`);
  } catch (err) {
    console.error(err);
  }
};
