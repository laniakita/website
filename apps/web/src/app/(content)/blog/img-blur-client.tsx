'use client';
import { useState } from 'react';
import Image from 'next/image';
import { type BlurClientProps } from './img-blur-server';

export default function BlogImageBlur({ src, alt, blur, height, width }: BlurClientProps) {
  const [beeg, setBeeg] = useState(false);
  return (
    <>
      {(beeg as unknown) === true && (
        <button
          type='button'
          className='fixed inset-x-0 top-0 z-[2] m-0 flex size-full h-screen cursor-zoom-out items-center justify-center  bg-ctp-midnight/20 p-0 backdrop-blur-md md:px-10'
          onClick={() => {
            setBeeg(false);
          }}
        >
          <Image
            priority={false}
            src={src}
            alt={alt}
            placeholder='blur'
            blurDataURL={blur}
            height={height}
            width={width}
            sizes='100vw'
            className='max-h-[80vh] object-contain'
          />
        </button>
      )}

      <button
        onClick={() => {
          setBeeg(true);
        }}
        type='button'
        className='relative m-0 block size-full cursor-zoom-in p-0'
      >
        <Image
          priority={false}
          src={src}
          alt={alt}
          placeholder='blur'
          blurDataURL={blur}
          height={height}
          width={width}
          sizes='100vw'
          className='m-0 object-contain p-0'
        />
      </button>
    </>
  );
}
