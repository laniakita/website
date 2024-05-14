'use client';
import { useState } from 'react';
import Image from 'next/image';
import { imageLoader } from '@/utils/image-loader';

interface ImgProps {
  src: string;
  alt: string;
}

export default function BlogImage({props, blurUrl}: {props: ImgProps, blurUrl: string}) {
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
            src={props.src}
            quality={75}
            placeholder='blur'
            blurDataURL={blurUrl}
            alt={props.alt}
            fill
            sizes='100vw'
            className='object-contain'
          />
        </button>
      )}

      <button type='button' className='relative m-0 size-full min-h-72 cursor-zoom-in p-0 md:min-h-96'>
        <Image
          loader={imageLoader}
          priority={false}
          src={props.src}
          placeholder='blur'
          blurDataURL={blurUrl}
          alt={props.alt}
          sizes='100vw'
          fill
          className='m-0 object-contain p-0'
          onClick={() => {
            setBeeg(true);
          }}
        />
      </button>
    </>
  );
}
