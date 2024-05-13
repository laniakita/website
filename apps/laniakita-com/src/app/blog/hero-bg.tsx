'use client';
import { useState } from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/shimmer-utils';
import type { PostTeaserObjectProps } from '@/app/blog/page';

export function HeroBg({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  const imageLoader = ({ src, width, quality }: { src?: string; width?: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality ?? 75}`;
  };

  const [beeg, setBeeg] = useState(false);
  return (
    <>
      {(beeg as unknown) === true && (
        <button
          type='button'
          className='fixed inset-x-0 top-0 z-[2] m-0 flex size-full h-screen max-h-[calc(100vh-4rem)] cursor-zoom-out items-center justify-center  bg-ctp-midnight/20 p-0 backdrop-blur-md md:px-10 lg:max-h-screen'
          onClick={() => {
            setBeeg(false);
          }}
        >
          <Image
            loader={imageLoader}
            priority={false}
            src={dataObject.heroFile!}
            alt={dataObject.heroAltText!}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
          />
        </button>
      )}
      <picture className='relative flex w-full md:max-w-3xl  lg:max-w-5xl'>
        <button
          type='button'
          className='cursor-zoom-in'
          onClick={() => {
            setBeeg(true);
          }}
        >
          <Image
            loader={imageLoader}
            src={dataObject.heroFile!}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            alt={dataObject.heroAltText!}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
          />
          {dataObject.heroCredit !== undefined && (
            <p className='absolute bottom-6 left-6 w-fit'>
              <span className='simple-color-trans w-fit rounded-full bg-ctp-base/80 px-4 py-1 backdrop-blur-md'>
                {dataObject.heroCredit} via <a href={dataObject.heroCreditUrl}>{dataObject.heroCreditUrlText}</a>
              </span>
            </p>
          )}
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
