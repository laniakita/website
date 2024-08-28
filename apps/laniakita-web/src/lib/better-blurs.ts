import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';

export const imageBase64 = async (src: string) => {
  const imgFile = await readFile(src);
  const {
    metadata: { height, width, format },
  } = await getPlaiceholder(imgFile);
  return { base64: `data:image/${format};base64,${Buffer.from(imgFile).toString('base64')}`, height, width, format };
};

export const betterBlur = async (src: string) => {
  const imgPath = path.resolve(path.join(process.cwd(), './public/', src));
  const imgFile = await readFile(imgPath);
  const {
    base64,
    metadata: { height, width },
  } = await getPlaiceholder(imgFile);

  return { base64, height, width };
};
