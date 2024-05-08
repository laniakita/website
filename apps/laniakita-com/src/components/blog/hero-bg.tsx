'use client';

import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/shimmer-utils';
import type { PostTeaserObjectProps } from '@/app/blog/page';

export function HeroBg({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  const imageLoader = ({ src, width, quality }: { src?: string; width?: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality ?? 75}`;
  };
  return (
    <picture className='relative flex min-h-80 w-full md:h-[30rem] md:max-w-3xl lg:h-[38rem] lg:max-w-4xl xl:h-[50rem] xl:max-w-7xl'>
      <Image
        loader={imageLoader}
        src={dataObject.heroFile!}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        alt={dataObject.heroAltText!}
        fill
        sizes='(max-width: 1200px) 100vw'
        //placeholder="blur"
        className='object-cover'
        //blurDataURL={blurUrl}
      />
      {dataObject.heroCredit !== undefined && (
        <p className='absolute bottom-6 left-6 w-full'>
          <span className='simple-color-trans w-fit rounded-full bg-ctp-base/80 px-4 py-1 backdrop-blur-md'>
            {dataObject.heroCredit} via <a href={dataObject.heroCreditUrl}>{dataObject.heroCreditUrlText}</a>
          </span>
        </p>
      )}
    </picture>
  );
}

/*
export const HeroBgFixed = ({ dataObject }: HeroProps) => {
  const imageLoader = ({ src, width, quality }: { src?: string; width?: number; quality?: number }) => {
    return `/assets/featured-images/${src}?w=${width}&q=${quality || 75}`;
  };
  return (
    <div className="relative min-h-[30rem] w-full [clip-path:_inset(0_0_0_0)]">
      <div className="fixed left-0 top-0 size-full  min-h-[30rem]">
        <Image
          loader={imageLoader}
          src={dataObject.heroImage as string}
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          alt={dataObject.heroAltText as string}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
          className="object-cover object-center"
          //blurDataURL={blurUrl}
        />
      </div>
    </div>
  );
}; */
