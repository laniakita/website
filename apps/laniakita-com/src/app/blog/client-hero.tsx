'use client'
import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useBeegStore } from '@/providers/beeg-store-provider';
import type { PostTeaserObjectProps } from '@/app/blog/page';

export function ClientBg({ dataObject, imageSource }: { dataObject: PostTeaserObjectProps, imageSource: StaticImport }) {
  const {beeg, setBeeg, setSmol} = useBeegStore((state) => state)
  return (
      <>
      {(beeg as unknown) === true && (
        <picture className='fixed inset-x-0 top-0 z-[2] m-0 size-full '>
          <button
            type='button'
            className='relative flex size-full h-screen max-h-[calc(100vh-4rem)] cursor-zoom-out items-center justify-center bg-ctp-midnight/20 p-0 backdrop-blur-md md:px-10 lg:max-h-screen'
            onClick={() => {
              setSmol();
            }}
          >
          <Image
            src={imageSource}
            placeholder="blur"
            priority={false}
            alt={dataObject.heroAltText!}
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: '100%', height: 'auto' }}
          />
          </button>
        </picture>
      )}
      <picture className='relative m-0 flex w-full items-center justify-center p-0'>
        <button
          type='button'
          className='relative m-0 size-full min-h-96 cursor-zoom-in p-0 sm:h-[30rem] md:h-[35rem] md:max-w-3xl lg:h-[45rem]  lg:max-w-5xl'
          onClick={() => {
            setBeeg();
          }}
        >
          <Image
            src={imageSource}
            placeholder="blur"
            alt={dataObject.heroAltText!}
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
