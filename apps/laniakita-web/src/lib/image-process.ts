import { existsSync } from 'node:fs';
import { readFile, copyFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';

// check in relative assets folder & public folder
const checkImgExists = (imgPath: string) => {
  let exists = false;
  let existsInPublic = false;

  // read image
  // 1. check if path exists
  if (existsSync(imgPath)) {
    exists = true;
  }
  // 2. check if path exists in public folder
  if (existsSync(`./public/${imgPath}`)) {
    existsInPublic = true;
  }

  return { exists: exists, existsInPublic: existsInPublic };
};

const checkDuplicate = async (imgPathOne: string, imgPathTwo: string) => {
  let isDupe = 0;
  // WARNING: assumes both images exist
  const imgOne = await lstat(imgPathOne);
  const imgTwo = await lstat(imgPathTwo);
  if (imgOne.size === imgTwo.size) {
    isDupe = 1;
  }

  return isDupe;
};

const imageMover = async ({ prefix, imgPath, debug }: { prefix: string; imgPath: string; debug?: boolean }) => {
  const rawPath = path.join(prefix, imgPath);
  const publicPath = path.join('./public', rawPath);
  const status = checkImgExists(rawPath);
  let copied = 0;
  let isDupe = 0;

  const copier = async () => {
    try {
      await copyFile(`./${rawPath}`, `./${publicPath}`);
      copied = 1;
      console.log('copied successfully to:', `/${publicPath}`);
    } catch (err) {
      console.error(`Critical Error: File could not be copied: ${err}`);
    }
    return copied;
  };

  // if valid & in public folder, check if new image is the same
  if (status.exists && status.existsInPublic) {
    isDupe = await checkDuplicate(rawPath, publicPath);
    if (isDupe === 0) {
      await copier();
    }
  }
  // if valid, but not in public folder, copy it
  if (status.exists && !status.existsInPublic) {
    await copier();
  }

  const result = {
    url: rawPath,
    _meta: debug ? {
      destination: publicPath,
      status: status,
      didCopy: copied === 1 ? 'copy' : 'no copy',
      reason: isDupe === 0 ? 'original' : 'duplicate',
    } : null,
  };

  return result;
};

const imageBlurBase64 = async (imgPath: string) => {
  const imgFile = await readFile(imgPath);
  const {
    base64,
    metadata: { height, width },
  } = await getPlaiceholder(imgFile);
  return { base64, height, width };
};

export const imageProcessor = async ({ prefix, imgPath, debug }: { prefix: string; imgPath: string; debug?: boolean }) => {
  try {
    const imgCopyRes = await imageMover({prefix: prefix, imgPath: imgPath, debug: debug});
    const blurRes = await imageBlurBase64(imgCopyRes.url);
    return { src: `/${imgCopyRes.url}`, ...blurRes, _debug: debug ? imgCopyRes._meta : false };
  } catch (err) {
    console.error(err);
  }
};
