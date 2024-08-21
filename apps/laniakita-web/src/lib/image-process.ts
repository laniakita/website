import { existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { readFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';

/**
 * A typeguarded version of `instanceof Error` for NodeJS.
 * @author Joseph JDBar Barron
 * @link https://dev.to/jdbar
 */
export function instanceOfNodeError<T extends new (...args: any) => Error>(
  value: Error,
  errorType: T,
): value is InstanceType<T> & NodeJS.ErrnoException {
  return value instanceof errorType;
}

// check in relative assets folder & public folder
const checkImgExists = (imgPath: string) => {
  let exists = false;

  // read image
  // 1. check if path exists
  if (existsSync(imgPath)) {
    exists = true;
  }

  return { exists: exists };
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

const imageMover = async ({
  contentDir,
  prefix,
  imgPath,
  debug,
}: {
  contentDir: string;
  prefix: string;
  imgPath: string;
  debug?: boolean;
}) => {
  if (debug) {
    console.log('image:', imgPath);
    console.log('url:', prefix);
  }

  const postParentRaw = prefix.split('/');
  postParentRaw.shift(); // removes CONTENT_DIR
  postParentRaw.pop(); // removes post filename
  const postParent = postParentRaw.join('/');
  const urlPath = path.join(postParent, imgPath);
  const rawPath = path.resolve(path.join(contentDir, postParent, imgPath));
  const publicPath = path.resolve(path.join('./public', postParent, imgPath));

  if (debug) {
    console.log('rawPath:', rawPath);
    console.log('publicPath:', publicPath);
  }

  const statusOne = checkImgExists(rawPath);
  const statusTwo = checkImgExists(publicPath);
  const status = {
    exists: statusOne.exists,
    existsInPublic: statusTwo.exists,
  };

  let copied = 0;
  let isDupe = 0;

  // using sync functions, it's faster for our purposes.
  const copier = (from: string, to: string) => {
    try {
      // important to make the directory, it won't copy otherwise (ENOENT).
      mkdirSync(path.dirname(to), { recursive: true });
      copyFileSync(from, to);
      copied = 1;
      console.log('copied successfully to:', to);
    } catch (err) {
      console.error(err);
    }
  };

  // if valid & in public folder, check if new image is the same
  if (status.exists && status.existsInPublic) {
    isDupe = await checkDuplicate(rawPath, publicPath);
    if (isDupe === 0) {
      copier(rawPath, publicPath);
    }
  }
  // if valid, but not in public folder, copy it
  if (status.exists && !status.existsInPublic) {
    copier(rawPath, publicPath);
  }

  const result = {
    url: urlPath,
    local: rawPath,
    _meta: debug
      ? {
          destination: publicPath,
          status: status,
          didCopy: copied === 1 ? 'copy' : 'no copy',
          reason: isDupe === 0 ? 'original' : 'duplicate',
        }
      : null,
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

export const imageProcessor = async ({
  contentDir,
  prefix,
  imgPath,
  debug,
}: {
  contentDir: string;
  prefix: string;
  imgPath: string;
  debug?: boolean;
}) => {
  try {
    const imgCopyRes = await imageMover({ contentDir: contentDir, prefix: prefix, imgPath: imgPath, debug: debug });
    const blurRes = await imageBlurBase64(imgCopyRes.local);
    return { src: `/${imgCopyRes.url}`, ...blurRes, _debug: debug ? imgCopyRes._meta : false };
  } catch (err) {
    console.error(err);
  }
};
