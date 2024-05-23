import { expect, test } from 'vitest';
import { batchPushMain } from '../bin/mdx-db/push-mdx';
import { authors } from '@/lib/db/schema/authors';

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
    priorityConfig: {
      authors: 1,
      tags: 2,
      'blog-posts': 3,
    },
    debug: false,
  });
  //expect(Array.isArray(res)).toBe(true);
});
