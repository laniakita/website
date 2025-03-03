import type { Metadata } from 'next';
import { compareDesc } from 'date-fns';
import Sidebar from '@/components/sidebar/main';
import PostRollerV4 from './post-roller-v4';
import Footer from '@/components/footer/footer';
import { allPages, allPosts } from '@/lib/fumadocs';

const data = allPages.find((page) => page.url === '/pages/blog');

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
      <div className='hidden md:flex md:w-full md:max-w-xs lg:max-w-sm'>
        <Sidebar />     
        </div>
      <main className='m-auto flex flex-col-reverse justify-center gap-4 px-page-common pt-blog simple-color-trans md:flex-row md:gap-6'>
        <div className='flex flex-col gap-16'>
          <PostRollerV4 posts={posts} isBlog />
          <Footer
            override
            overrideBlog
            outsidePadding='pb-10 lg:pb-common px-8 md:px-0 lg:px-0'
            insidePadding='p-0 md:p-0 lg:p-10'
            linksContainerPadding='py-4 px-0'
            iconContainerPadding='px-0'
          />
        </div>
        <div className='block md:hidden'>
        </div>
      </main>
    </div>
  );
}
