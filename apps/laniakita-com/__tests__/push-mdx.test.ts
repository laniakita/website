import { expect, test } from 'vitest';
import { batchPushMain } from '../bin/mdx-db/push-mdx';

const contentFolder = './__tests__/test_content';
const foldersToExclude = ['./assets']; // Example excluded folders
const filesToExclude = ['README.md']; // Example excluded files
const goodConfig = {
  contentFolder,
  foldersToExclude,
  filesToExclude,
  debug: false,
};

test('batchPushMain does something', async () => {
  const res = await batchPushMain({
    ...goodConfig,
    imageKey: 'heroFile',
    publicPath: 'tests/assets/images/featured',
    debug: false,
  });
  //expect(Array.isArray(res)).toBe(true);
});
