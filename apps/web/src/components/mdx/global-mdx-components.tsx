import type { FC } from 'react';
import Link from 'next/link';
import type { Category, Page, Post, Tag, Work } from 'contentlayer/generated';
import BlogImageBlurServer from './img-blur-server';
import { Paragraph } from './paragraph';
import { getMDXComponent } from './mdx-bundler-components';

export const globalMdxComponents = { p: Paragraph, img: BlogImageBlurServer, a: Link as unknown as FC };

export default function GlobalMDXComponent(data: Post | Page | Category | Tag | Work) {
  //eslint-disable-next-line -- ignore
  const MDXContent = getMDXComponent(data.body.code, {});
  return <MDXContent code={data.body.code} components={globalMdxComponents} />;
}

