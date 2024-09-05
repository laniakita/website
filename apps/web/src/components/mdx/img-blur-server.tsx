import { type FC } from 'react';
import { betterBlur } from '@/lib/better-blurs';
import BlogImageBlur from './img-blur-client';

export interface BlurClientProps {
  src: string;
  alt: string;
  blur: string;
  height: number;
  width: number;
}

interface ImgProps {
  src: string;
  alt: string;
}

/*eslint-disable react/function-component-definition -- mdx bundlers component substitution type complains without this formatting */
const BlogImageBlurServer: FC = async (props) => {
  if (!(props as unknown)) return;
  const blurRes = await betterBlur((props as ImgProps).src);
  const propsObj = {
    src: (props as ImgProps).src,
    alt: (props as ImgProps).alt,
    blur: blurRes.base64,
    height: blurRes.height,
    width: blurRes.width,
  };
  return (
    <figure>
      <picture>
        <BlogImageBlur
          src={propsObj.src}
          alt={propsObj.alt}
          blur={propsObj.blur}
          height={propsObj.height}
          width={propsObj.width}
        />
      </picture>
      <figcaption className='font-mono text-sm font-thin'>{propsObj.alt}</figcaption>
    </figure>
  );
};
export default BlogImageBlurServer;
