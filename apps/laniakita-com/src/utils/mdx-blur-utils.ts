import { toBase64Blur } from "./blur-util";
import { PostTeaserObjectProps, WorkMetaProps, fetchFrontmatter, fetchMDXfiles } from "./mdx-utils";

export const batchMatterFetchWithBlurs = async (inputFolder: string) => {
  try {
    const fetchPaths = await fetchMDXfiles(inputFolder);
    const matterMeta = await Promise.all(
      fetchPaths.map(async (mdxPath: string) => {
        const metaObj = await fetchFrontmatter(mdxPath);
        if ((metaObj as PostTeaserObjectProps).heroFile ?? (metaObj as WorkMetaProps).teaserImg) {
          const blurUrl = await toBase64Blur(
            (metaObj as PostTeaserObjectProps).heroFile ?? (metaObj as WorkMetaProps).teaserImg!,
          );
          return { ...metaObj, blurUrl };
        }
        return metaObj;
      }),
    );
    const sortedMetas = matterMeta.sort((a, b) => {
      return b.date - a.date;
    });
    return sortedMetas;
  } catch (err) {
    console.error(err);
  }
};

export const batchMatterFetchByTypeWithBlurs = async (inputFolder: string, matterType: string, resToMatch: string) => {
  const resFetchAll = await batchMatterFetchWithBlurs(inputFolder);
  if (!resFetchAll) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic function
  const matchArr = resFetchAll.map((post: any) => {
    //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- generic function
    if (post[matterType] === resToMatch) {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-return -- generic function
      return post;
    }
    return undefined;
  });
  const finalArr = matchArr.filter((el) => el);

  //eslint-disable-next-line @typescript-eslint/no-unsafe-return -- generic function
  return finalArr;
};
