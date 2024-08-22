'use client';
import Image from 'next/image';
import { imageLoader } from '@/utils/image-loader';
import localLoader from '@/lib/local-loader';
import { type Post } from 'contentlayer/generated';

export function HeroBlur2(post: Post) {
  return (
    <picture className='relative m-0 flex size-full max-w-5xl items-center justify-center p-0'>
      <Image
        loader={
          //imageLoader
          localLoader
        }
        src={post.featured_image.src}
        alt={post.featured_image.altText}
        placeholder='blur'
        blurDataURL={post.featured_image.base64}
        height={post.featured_image.height}
        width={post.featured_image.width}
        sizes='(max-width: 500px) 100vw, (max-width: 1024px) 80vw'
        style={{ objectFit: 'contain' }}
        className='overflow-hidden'
      />
    </picture>
  );
}
