import { queryPostMetas } from '@/lib/utils/mdxlite-utils';
import { PostNumStoreProvider } from '@/providers/postnum-store-provider';
import PreviewRollerV3 from '@/components/blog/post-roller-v3';

export const metadata = {
  title: "Lani's Web Dev Blog",
  description: "A Full-Stack web developer's blog, written by Lani Akita.",
  openGraph: {
    title: "Lani's Web Dev Blog",
    description: "A Full-Stack web developer's blog, written by Lani Akita.",
  },
  twitter: {
    card: 'summary',
    title: "Lani's Web Dev Blog",
    description: "A Full-Stack web developer's blog, written by Lani Akita.",
  },
};

export interface PostTeaserObjectProps {
  id: string;
  authorName: string;
  date: string;
  headline: string;
  subheadline?: string;
  category?: string;
  heroFile?: string;
  heroCredit?: string;
  heroCreditUrl?: string;
  heroCreditUrlText?: string;
  heroAltText?: string;
}

export default async function BlogPage() {
  const res = await queryPostMetas();
  return (
    <PostNumStoreProvider>
      <div className='flex flex-col'>
        {res.length >= 1 ? (
          <PreviewRollerV3 dataArr={res as PostTeaserObjectProps[]} />
        ) : (
          <div className='flex h-screen items-center justify-center'>
            <p>{`no posts found. hmm something's not right here.`}</p>
          </div>
        )}
      </div>
    </PostNumStoreProvider>
  );
}
