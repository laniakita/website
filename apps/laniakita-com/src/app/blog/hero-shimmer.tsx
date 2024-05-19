'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';
import { imageLoader } from '@/utils/image-loader';
import { shimmer, toBase64 } from '@/utils/shimmer-utils';

export function HeroShimmer({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  return (
    <picture className='relative m-0 flex size-full min-h-48 items-center justify-center p-0 narrow-phone:min-h-64 small-phone:min-h-72 sm:h-[30rem] md:h-[35rem] md:max-w-3xl lg:h-[45rem]  lg:max-w-5xl'>
      <Image
        loader={imageLoader}
        src={dataObject.heroFile!}
        alt={dataObject.heroAltText!}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        fill
        sizes='(max-width: 500px) 100vw, (max-width: 1024px) 80vw'
        style={{ objectFit: 'contain' }}
        className='overflow-hidden'
      />
    </picture>
  );
}

export function HeroShimmerZoom({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  const [beeg, setBeeg] = useState(false);
  return (
    <>
      {(beeg as unknown) === true && (
        <picture className='fixed inset-x-0 top-0 z-[2] m-0 size-full '>
          <button
            type='button'
            className='relative flex size-full h-screen max-h-[calc(100vh-4rem)] cursor-zoom-out items-center justify-center bg-ctp-midnight/20 p-0 backdrop-blur-md md:px-10 lg:max-h-screen'
            onClick={() => {
              setBeeg(false);
            }}
          >
            <picture className='relative m-0 size-full max-h-[80vh] overflow-hidden p-0'>
              <Image
                loader={imageLoader}
                priority={false}
                src={dataObject.heroFile!}
                alt={dataObject.heroAltText!}
                fill
                sizes='100vw'
                className='object-contain'
              />
            </picture>
          </button>
        </picture>
      )}
      <picture className='relative m-0 flex w-full items-center justify-center p-0'>
        <button
          type='button'
          className='relative m-0 size-full min-h-96 cursor-zoom-in p-0 sm:h-[30rem] md:h-[35rem] md:max-w-3xl lg:h-[45rem]  lg:max-w-5xl'
          onClick={() => {
            setBeeg(true);
          }}
        >
          <Image
            loader={imageLoader}
            src={dataObject.heroFile!}
            alt={dataObject.heroAltText!}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            sizes='100vw'
            fill
            className='m-0 object-cover p-0'
          />
        </button>
      </picture>
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
