'use client';
import Image from 'next/image';
import { imageLoader } from '@/utils/image-loader';
import type { PostQ } from '@/lib/node-db-funcs';

export function HeroBlur({ dataObject }: { dataObject: PostQ }) {
  return (
    <picture className='relative m-0 flex size-full max-w-5xl items-center justify-center p-0'>
      <Image
        loader={imageLoader}
        src={dataObject.featuredImage.fileLocation}
        alt={dataObject.featuredImage.altText}
        placeholder='blur'
        blurDataURL={dataObject.featuredImage.blur}
        height={dataObject.featuredImage.height}
        width={dataObject.featuredImage.width}
        sizes='(max-width: 500px) 100vw, (max-width: 1024px) 80vw'
        style={{ objectFit: 'contain' }}
        className='overflow-hidden'
      />
    </picture>
  );
}
