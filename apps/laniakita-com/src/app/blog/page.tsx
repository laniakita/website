import matter from 'gray-matter';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import { type PostTeaserObjectProps, fetchMdx, batchMatterFetch } from '@/utils/mdx-utils';
import PreviewRollerV3 from './post-roller-v3';
import { QueryPostMetaItem, descriptionHelper, queryPostByIdForJustRawStr, queryPostMetas } from '@/lib/node-db-funcs';
import { postsToTags } from '@/lib/db/schema/posts';

export const metadata = {
  title: 'Yet Another Dev Blog',
  description: "A blog that's mostly about the process of developing (web-based) software.",
  openGraph: {
    title: 'Yet Another Dev Blog',
    description: "A blog that's mostly about the process of developing (web-based) software.",
  },
  twitter: {
    card: 'summary',
    title: 'Yet Another Dev Blog',
    description: "A blog that's mostly about the process of developing (web-based) software.",
  },
};

export default async function BlogPage() {
  const res = (await queryPostMetas()) as unknown as QueryPostMetaItem[];


  /*
  const data = await batchMatterFetch('./src/app/blog/posts/published');
  const folder = './src/app/blog/posts/published';
  const descRes = await fetchMdx(folder, (data as unknown as PostTeaserObjectProps[])[0]!.slug);
  const projDescrMatter = matter(descRes!).content;
  */
  const postId = res[0]?.id as string
  const descrRes = await queryPostByIdForJustRawStr(postId);
  const rawDescr = descrRes?.rawStr
  const findDescr = descriptionHelper(rawDescr!)

  const descr = findDescr ? findDescr?.filter((el) => el) : ''
  
  return (
    <PostNumStoreProvider>
      <main className='motion-safe:simple-color-trans flex flex-col bg-ctp-base dark:bg-ctp-midnight'>
        {res !== undefined && res.length >= 1 ? (
          <PreviewRollerV3 dataArr={res} featuredDescr={descr[0]} />
        ) : (
          <div className='flex h-screen items-center justify-center'>
            <p>{`no posts found. hmm something's not right here.`}</p>
          </div>
        )}
      </main>
    </PostNumStoreProvider>
  );
}
