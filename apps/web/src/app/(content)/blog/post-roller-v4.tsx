'use client';

import { usePathname } from 'next/navigation';
import { SubscribeBox } from '@/components/sidebar/main';
import PostPreviewV4 from './post-components';
import { allPosts } from '@/lib/fumadocs';

export default function PostRollerV4({ postString }: { postString: string }) {
  const posts = JSON.parse(postString) as typeof allPosts;

  const uniqueKey = (idx: number) => {
    const num = Math.floor(Math.random() * 1000 + idx);

    return `blog-post-${crypto.randomUUID()}-${num}-${idx}`;
  };

  const pathname = usePathname();

  const isBlog = pathname === '/blog' && true;

  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-4 md:gap-6'>
        {isBlog
          ? posts.map((post, idx) =>
              idx === 1 ? (
                <div key={crypto.randomUUID()} className='flex flex-col gap-4 md:gap-6'>
                  <SubscribeBox mobile />
                  <PostPreviewV4 {...post} />
                </div>
              ) : (
                <PostPreviewV4 key={crypto.randomUUID()} {...post} />
              ),
            )
          : posts.map((post, idx) => <PostPreviewV4 key={uniqueKey(idx)} {...post} />)}
      </div>
    </div>
  );
}
