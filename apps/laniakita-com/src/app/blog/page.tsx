import matter from 'gray-matter';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import { type PostTeaserObjectProps, batchMatterFetchWithBlurs, fetchMdx } from '@/utils/mdx-utils';
import PreviewRollerV3 from './post-roller-v3';

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
  const data = await batchMatterFetchWithBlurs('./src/app/blog/posts/published');
  const folder = './src/app/blog/posts/published';
  const descRes = await fetchMdx(folder, (data as unknown as PostTeaserObjectProps[])[0]!.slug);
  const projDescrMatter = matter(descRes!).content;

  const findDescr = projDescrMatter.split('\n').map((strPara) => {
    if (strPara !== '' && strPara.split(' ')[0] !== 'import' && strPara.split(' ')[0] !== '##') {
      return strPara;
    }
    return undefined;
  });

  const descr = findDescr.filter((el) => el);

  return (
    <PostNumStoreProvider>
      <div className='flex flex-col'>
        {data !== undefined && data.length >= 1 ? (
          <PreviewRollerV3 dataArr={data as PostTeaserObjectProps[]} featuredDescr={descr[0]} />
        ) : (
          <div className='flex h-screen items-center justify-center'>
            <p>{`no posts found. hmm something's not right here.`}</p>
          </div>
        )}
      </div>
    </PostNumStoreProvider>
  );
}
