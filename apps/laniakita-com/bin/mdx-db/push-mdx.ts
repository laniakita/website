#! /usr/bin/env bun
/* eslint-disable no-undef -- bun is bun */
/* eslint-disable no-console -- bun is bun */
import { type BatchFetchMain, batchFetchMain } from './fetch-mdx';

export const batchPushMain = async (fetchConfig: BatchFetchMain) => {
  // get processed front matter array
  const matterRes = await batchFetchMain(fetchConfig);
  console.log(matterRes);

  if (!matterRes) {
    console.log('Ooops, no data found!');
    return;
  }

  // arr is sorted by priority so this should work:
  const pushIn = matterRes.map((processedMDX) => {
    if (processedMDX && 'type' in processedMDX) {
      console.log('inserting', processedMDX.type)
    }
  })


};
