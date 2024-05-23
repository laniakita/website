#! /usr/bin/env bun
/* eslint-disable no-console -- bun is bun */
import { type BatchFetchMain, batchFetchMain } from './fetch-mdx';

interface DbFunctionsProps {
  dbFunctionModules: {
    insert: Record<string, unknown>;
  };
}

export const batchPushMain = async (fetchConfig: BatchFetchMain & DbFunctionsProps) => {
  // get processed front matter array
  const matterRes = await batchFetchMain(fetchConfig);

  if (!matterRes) {
    fetchConfig.debug && console.log('Ooops, no data found!');
    return;
  }

  // arr is sorted by priority so this should work:
  matterRes.map((processedMDX) => {
   if (processedMDX && 'type' in processedMDX && processedMDX.type as string) {
    const funcType = processedMDX.type as string;
    if (funcType in fetchConfig.dbFunctionModules.insert) {
      const insModRaw = fetchConfig.dbFunctionModules.insert[funcType] as Record<string, string>;
      const insModKeys = Object.keys(insModRaw)
      const insModStr =  insModKeys[0];
      if ((insModStr as string) in insModRaw) {

      console.log(insModRaw[insModStr!])
      }
    }
   }
   return undefined;
  });

  return undefined;
};

/*
 if (!processedMDX) return;
    if (!('type' in processedMDX)) return;
    if ((processedMDX.type as string) in fetchConfig.dbFunctionModules.insert) {
      console.log(fetchConfig.dbFunctionModules.insert[processedMDX.type as string]);
      return
    } else if (processedMDX.type) {
      console.log(processedMDX.type);
      return
    }
    return;

if (
      processedMDX &&
      'type' in processedMDX &&
      'priority' in processedMDX &&
      typeof processedMDX.priority === 'number' &&
      fetchConfig.priorityConfig &&
      'type' in fetchConfig.priorityConfig
    ) {
      if (fetchConfig.priorityConfig.type && fetchConfig.priorityConfig.type === fetchConfig.dbFunctionModules.insert[fetchConfig.priorityConfig.type]) {
        fetchConfig.debug && console.log('inserting', processedMDX.type, 'with priority', processedMDX.priority);
      }
      return undefined;
    }
    return undefined;
*/

// setup
const testConfig = {
  contentFolder: './__tests__/test_content',
  foldersToExclude: ['./assets'],
  filesToExclude: ['README.md'],
  imageKey: 'heroFile',
  publicPath: 'tests/assets/images/featured',
  priorityConfig: {
    authors: 1,
    tags: 2,
    'blog-posts': 3,
  },
  dbFunctionModules: {
    insert: {
      authors: { insertAuthors: '@/lib/db-funcs' },
      tags: { insertTags: '@/lib/db-funcs' },
    },
  },
  debug: false,
};

await batchPushMain(testConfig);
