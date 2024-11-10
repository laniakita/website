import type { Metadata } from 'next';
import { compareDesc } from 'date-fns';
import { allPages, allPosts } from 'contentlayer/generated';
import Sidebar from '@/components/sidebar/main';
import PostRollerV4 from './post-roller-v4';

const data = allPages.find((page) => page.url === '/blog');

export const metadata: Metadata = {
  title: data?.title,
  authors: [{ name: 'Lani Akita' }],
  description: data?.description,
  openGraph: {
    title: data?.title,
    description: data?.description,
    images: [
      {
        alt: data?.title,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/static/blog`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: data?.title,
    description: data?.description,
    images: [
      {
        alt: data?.title,
        type: 'image/png',
        width: 1600,
        height: 900,
        url: `/opengraph/static/blog?twitter=true`,
      },
    ],
  },
};

export default function BlogPage2() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date)));
  return (
    <div className='flex size-full flex-row'>
      <main className='simple-color-trans common-padding flex size-full flex-col-reverse justify-center gap-4 bg-ctp-base md:flex-row md:gap-6 dark:bg-ctp-midnight'>
        <PostRollerV4 posts={posts} />
        <div className='block md:hidden'>
          <Sidebar />
        </div>
      </main>
      <div className='hidden md:block'>
        <Sidebar />
      </div>
    </div>
  );
}
