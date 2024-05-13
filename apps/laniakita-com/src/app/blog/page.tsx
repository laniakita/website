import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import { batchMatterFetch } from '@/utils/mdx-utils';
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

  return (
    <PostNumStoreProvider>
      <div className='flex flex-col'>
        {data !== undefined && data.length >= 1 ? (
          <PreviewRollerV3 dataArr={data as PostTeaserObjectProps[]} />
        ) : (
          <div className='flex h-screen items-center justify-center'>
            <p>{`no posts found. hmm something's not right here.`}</p>
          </div>
        )}
      </div>
    </PostNumStoreProvider>
  );
}
