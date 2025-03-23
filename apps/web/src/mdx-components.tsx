import type { MDXComponents } from 'mdx/types';
import { Paragraph } from '@/components/mdx/components/paragraph';
import Anchors from '@/components/mdx/components/anchor-tags';
import PreCodeV2 from '@/components/mdx/components/pre-code/codeblock-v2';
import Section from '@/components/mdx/components/section/wrapper';
import Image, { ImageProps } from 'next/image';
import SectionCore from './components/mdx/components/section/section';

export function ImgReplacer(props: ImageProps) {
  return (
    <figure>
      {/* eslint-disable jsx-a11y/alt-text -- image generator, not html. */}
      <Image {...props} className='h-auto w-full' />
      <figcaption className='font-mono text-xs'>{props.alt}</figcaption>
    </figure>
  );
}

export const mdxComponents = {
  p: Paragraph,
  img: ImgReplacer,
  pre: PreCodeV2,
  a: Anchors,
  section: SectionCore,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: (props) => <Paragraph {...props} />,
    img: (props) => <Image {...(props as ImageProps)} />,
    // @ts-expect-error -- types
    pre: (props) => <PreCodeV2 {...props} />,
    // @ts-expect-error -- types
    a: (props) => <Anchors {...props} />,
    // @ts-expect-error -- types
    section: (props) => <Section {...props} />,
    ...components,
  };
}
