'use client';

import Image from 'next/image';
import { shimmer, toBase64 } from '@/lib/utils/shimmer-utils';


export function HeroBg({ dataObject }: { dataObject: { heroImage?: string; heroAltText?: string } }) {
  const imageLoader = ({ src, width, quality }: { src?: string; width?: number; quality?: number }) => {
    return `/assets/featured-images/${src}?w=${width}&q=${quality ?? 75}`;
  };
  return (
    <>
      {dataObject.heroImage && dataObject.heroAltText ? (
        <div className='relative h-[60vh] min-h-[40rem]'>
          <Image
            loader={imageLoader}
            src={dataObject.heroImage}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            alt={dataObject.heroAltText}
            fill
            sizes='(max-width: 1200px) 100vw'
            //placeholder="blur"
            className='object-cover object-center'
            //blurDataURL={blurUrl}
          />
        </div>
      ) : (
        ''
      )}
    </>
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
