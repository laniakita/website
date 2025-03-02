import Image from 'next/image';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { blog } from '$/.source';

export function HeroBlur2(post: typeof blog[0]) {
  const res = post.featured_image as FeaturedImageR1;

  return (
    <picture className='relative m-0 flex size-full max-w-5xl items-center justify-center p-0'>
      <Image
        src={res.src}
        alt={res.altText}
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
