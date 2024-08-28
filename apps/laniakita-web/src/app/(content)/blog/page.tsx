import type { Metadata } from 'next';
import { compareDesc } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import Sidebar from '@/components/sidebar/main';
import { BLOG_DESCR } from '@/lib/constants';
import PostRollerV4 from './post-roller-v4';

const title = 'Blog';
const description = BLOG_DESCR;

export const metadata: Metadata = {
  title,
  authors: [{ name: 'Lani Akita' }],
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

export default function BlogPage2() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  //console.dir(posts, {depth: null})
  return (
    <main className='simple-color-trans common-padding flex size-full flex-col-reverse justify-center gap-4 bg-ctp-base dark:bg-ctp-midnight md:flex-row md:gap-6'>
      <PostRollerV4 posts={posts} />
      <Sidebar />
    </main>
  );
}
