/*
 * v3 functions
 * 
 * These are functions optimized for getStaticParams() since that will perform 
 * the batch call once, and then flesh out each page. However, I'm unsure if 
 * this would be suitable for the actual page function itself, since it would batch call every post, for each page.
 *  
 * The way these work is simple. Assuming we have an array of objects that
 * include a path location, then all we have to do is match the params and
 * return a path.
 *
 * First batch process all the posts (preferably in a useMemo() hook).
 * Then, feed that data into the functions down below to find what you're
 * looking for.
 *
 * Doing things this way saves all the trouble of backstepping and searching for
 * folders multiple times on nested posts.
 *
 */

// get post by uuid from array
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
const fetchMDXByUUID = (postArr: any[], uuid: string) => {
  const rawSearchArr = postArr.map((post) => {
    if ('uuid' in post && post.uuid === uuid) {
      return post;
    }
    return undefined;
  });
  const foundArr = rawSearchArr.filter((el) => el);
  if (foundArr[0] !== undefined) {
    return foundArr[0];
  }
  return;
};

// get post by uuid from array
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
const fetchMDXBySlug = (postArr: any[], slug: string) => {
  const rawSearchArr = postArr.map((post) => {
    if ('slug' in post && post.slug === slug) {
      return post;
    }
    return undefined;
  });
  const foundArr = rawSearchArr.filter((el) => el);
  if (foundArr[0] !== undefined) {
    return foundArr[0];
  }
  return;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
export const fetchMDXByUUIDorSlug = (postArr: any[], uuid: string, slug: string) => {
  const postBySlug = fetchMDXBySlug(postArr, slug);
  if (postBySlug !== undefined) return postBySlug;
  const postByUUID = fetchMDXByUUID(postArr, uuid);
  if (postByUUID !== undefined) return postByUUID;
};
