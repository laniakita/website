import matter from 'gray-matter';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import { batchMatterFetch, fetchMdx } from '@/utils/mdx-utils';
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

export interface PostTeaserObjectProps {
  id: string;
  slug: string;
  authorName: string;
  date: string;
  headline: string;
  subheadline?: string;
  'category-slug'?: string;
  heroFile?: string;
  heroCaption?: string;
  heroCredit?: string;
  heroCreditUrl?: string;
  heroCreditUrlText?: string;
  heroAltText?: string;
}

export default async function BlogPage() {
  const data = await batchMatterFetch('./src/app/blog/posts/published');
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
