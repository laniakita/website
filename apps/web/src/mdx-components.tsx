/* eslint-disable jsx-a11y/alt-text,@next/next/no-img-element -- false positive */
import type { MDXComponents } from 'mdx/types';
//import BlogImageBlurServer from '@/components/mdx/components/img-blur-server';
import { Paragraph } from '@/components/mdx/components/paragraph';
import Anchors from '@/components/mdx/components/anchor-tags';
import PreCodeV2 from '@/components/mdx/components/pre-code/codeblock-v2';
import Section from '@/components/mdx/components/section/wrapper';
import Image, { ImageProps } from 'next/image';

function ImgReplacer(props: ImageProps) {
  return <Image {...props} />
}

export const mdxComponents = {
  p: Paragraph,
  img: ImgReplacer,
  pre: PreCodeV2,
  a: Anchors,
  section: Section
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // @ts-expect-error -- types
    p: (props) => <Paragraph {...props} />,
    img: (props) => <Image {...props as ImageProps} />,
    // @ts-expect-error -- types
    pre: (props) => <PreCodeV2 {...props} />,
    // @ts-expect-error -- types
    a: (props) => <Anchors {...props} />,
    // @ts-expect-error -- types
    section: (props) => <Section {...props} />,
    ...components,
  };
}
