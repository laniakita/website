import { expect, test } from 'vitest';
import { batchFetchMDXPaths } from '../bin/mdx-db/mdx-get';

test('batchFetchMDXPaths produces an array of valid paths to mdx files given a configuration object', async () => {
  const contentFolder = './__tests__/test_content';
  const foldersToExclude = ['./assets']; // Example excluded folders
  const filesToExclude = ['README.md']; // Example excluded files

  const result = await batchFetchMDXPaths({
    contentFolder,
    foldersToExclude,
    filesToExclude,
    debug: false,
  });

  // Assert that the result is an array
  expect(Array.isArray(result)).toBe(true);

  // Assert that each item in the array is a valid path
  result?.forEach((path) => {
    expect(typeof path).toBe('string');
    expect(path?.startsWith(contentFolder)).toBe(true);
    expect(path?.endsWith('.mdx') || path?.endsWith('.md')).toBe(true);
  });
});

test('batchFetchMDXPaths fails task (invalid folder path) successfully', async () => {
  const invalidContentFolder = '/non-existent-folder'; // Example invalid folder

  const result = await batchFetchMDXPaths({
    contentFolder: invalidContentFolder,
    suppressErr: true
  });

  // Assert that the result is undefined (due to error handling)
  expect(result).toBeUndefined();
});
