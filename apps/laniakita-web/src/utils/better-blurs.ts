import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';

export const betterBlur = async (src: string) => {
  const imgPath = path.resolve(path.join(process.cwd(), './public/', src));
  const imgFile = await readFile(imgPath);
  const {
    base64,
    metadata: { height, width },
  } = await getPlaiceholder(imgFile);

  return { base64, height, width };
};
