#! /usr/bin/env bun
/* eslint-disable no-console -- bun is bun */
import { type BatchFetchMain, batchFetchMain } from './fetch-mdx';

interface DbFunctionsProps {
  dbFunctionModules: {
    insert: Record<string, unknown>;
  };
}

export const batchPushMain = async (fetchConfig: BatchFetchMain & DbFunctionsProps): Promise<void> => {
  // get processed front matter array
  const matterRes = await batchFetchMain(fetchConfig);

  if (!matterRes) {
    fetchConfig.debug && console.log('Ooops, no data found!');
    return;
  }

  // arr is sorted by priority so this should work:
  await Promise.all(
    matterRes.map(async (processedMDX): Promise<void> => {
      if (processedMDX && 'type' in processedMDX && (processedMDX.type as string)) {
        const funcType = processedMDX.type as string;
        if (funcType in fetchConfig.dbFunctionModules.insert) {
          const insModRaw = fetchConfig.dbFunctionModules.insert[funcType] as Record<string, string>;
          const insModKeys = Object.keys(insModRaw);
          const insModStr = insModKeys[0]!;
          const insModPath = insModRaw[insModStr]!;
          if (insModStr && insModPath) {
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- importing types would be a lot to ask for */
            const dbFuncs = await import(insModPath);
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- importing types would be a lot to ask for */
            await dbFuncs[insModStr](processedMDX);
           }
        }
      }
    }),
  );
};

