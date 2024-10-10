#! /usr/bin/env bun
import { mkdir } from 'node:fs/promises';
import {  allProjects } from 'contentlayer/generated';

const allProjectsRes = () => {
  return allProjects.map((doc) => {
    const { ...content } = doc;
    return content;
  });
};

export const writeMinifiedContent = async () => {
  const t0 = performance.now();
  console.info(`Creating ${allProjects.length} minified tags...`);

  try {
    const projectsMin = allProjectsRes();

    const mainDir = './.contentlayermini/generated';
    const mainOut = 'index.json';

    const projDir = `${mainDir}/Project`;

    await mkdir(projDir, { recursive: true });

    await Bun.write(`${projDir}/${mainOut}`, JSON.stringify(projectsMin));

    const t1 = performance.now();
    const tDelta = `${t1 - t0} ms`;

    console.info(`[SUCCESS]: wrote ${allProjects.length} mini projects to ${projDir}/${mainOut} in ${tDelta}`);
  } catch (err) {
    console.error(err);
  }
};
