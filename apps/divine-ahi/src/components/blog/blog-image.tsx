'use client';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/lib/utils/shimmer-utils';

interface ImgProps {
  src: string;
  alt: string;
}

export default function BlogImage(props: ImgProps) {
  const fileNameGuesser = (props).src.split('/');
  const imageLoader = ({ src, width, quality }: { src?: string; width?: number; quality?: number }) => {
    return `/assets/images/${fileNameGuesser[3]}/${src}?w=${width}&q=${quality ?? 50}`;
  };
  return (
    <Image
      loader={imageLoader}
      priority={false}
      src={fileNameGuesser[4]!}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      alt={(props).alt}
      width={500}
      height={500}
      className='size-auto'
    />
  );
};

