'use client';

import { useId } from 'react';
import { usePathname } from 'next/navigation';
import type { Post } from 'contentlayer/generated';
import { SubscribeBox } from '@/components/sidebar/main';
import PostPreviewV4 from './post-components';

export default function PostRollerV4({ posts }: { posts: Post[] }) {
  const uniqueKey = useId();
  const pathname = usePathname();

  const isBlog = pathname === '/blog' && true;

  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-4 md:gap-6'>
        {isBlog
          ? posts.map((post, idx) =>
              idx === 1 ? (
                <div
                  key={`subscribe-blog-post-${uniqueKey}-${Math.floor(Math.random() * 1000 + idx)}`}
                  className='flex flex-col gap-4 md:gap-6'
                >
                  <SubscribeBox mobile />
                  <PostPreviewV4 {...post} />
                </div>
              ) : (
                <PostPreviewV4 key={`blog-post-${uniqueKey}-${Math.floor(Math.random() * 1000 + idx)}`} {...post} />
              ),
            )
          : posts.map((post, idx) => (
              <PostPreviewV4 key={`blog-post-${uniqueKey}-${Math.floor(Math.random() * 1000 + idx)}`} {...post} />
            ))}
      </div>
    </div>
  );
}
