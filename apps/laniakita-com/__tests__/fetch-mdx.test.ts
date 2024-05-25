import { expect, test } from 'vitest';
import { batchFetchMDXPaths, batchFetchMain } from '../bin/mdx-db/fetch-mdx';

const contentFolder = './__tests__/test_content';
const foldersToExclude = ['./assets']; // Example excluded folders
const filesToExclude = ['README.md']; // Example excluded files

const goodConfig = {
  contentFolder,
  foldersToExclude,
  filesToExclude,
  debug: false,
};

test('batchFetchMDXPaths produces an array of valid paths to mdx files given a configuration object', async () => {
  const result = await batchFetchMDXPaths(goodConfig);

  // Assert that the result is an array
  expect(Array.isArray(result)).toBe(true);

  // Assert that each item in the array is a valid path
  result?.forEach((path) => {
    expect(typeof path).toBe('string');
    expect(path.startsWith(contentFolder)).toBe(true);
    expect(path.endsWith('.mdx') || path.endsWith('.md')).toBe(true);
  });
});

test('batchFetchMDXPaths fails task (invalid folder path) successfully', async () => {
  const invalidContentFolder = '/non-existent-folder'; // Example invalid folder

  const result = await batchFetchMDXPaths({
    contentFolder: invalidContentFolder,
    suppressErr: true,
  });

  // Assert that the result is undefined (due to error handling)
  expect(result).toBeUndefined();
});

// can't test this if testing push functions (which will test this function, albeit indirectly). front matter is altered in memory, running the same calls basically breaks it.

test('batchFetchMain produces an array of front matter objects', async () => {
  const res = await batchFetchMain({
    ...goodConfig,
    imageKey: 'fileLocation',
    publicPath: 'tests/assets/images/featured',
    priorityConfig: {
      authors: 1,
      tags: 2,
      featuredImages: 3,
      posts: 4,
    },
    debug: false,
  });
  expect(Array.isArray(res)).toBe(true);
});
