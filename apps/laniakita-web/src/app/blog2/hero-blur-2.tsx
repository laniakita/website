'use client';
import Image from 'next/image';
//import { imageLoader } from '@/utils/image-loader';
import localLoader from '@/lib/local-loader';
import { type Post } from 'contentlayer/generated';
import type { ImageR1 } from 'contentlayer.config';

export function HeroBlur2(post: Post) {
  const res = post.featured_image as ImageR1;

  return (
    <picture className='relative m-0 flex size-full max-w-5xl items-center justify-center p-0'>
      <Image
        loader={
          //imageLoader
          localLoader
        }
        src={res.src!}
        alt={res.altText!}
        placeholder='blur'
        blurDataURL={res.base64}
        height={res.height}
        width={res.width}
        sizes='(max-width: 500px) 100vw, (max-width: 1024px) 80vw'
        style={{ objectFit: 'contain' }}
        className='overflow-hidden'
      />
    </picture>
  );
}
