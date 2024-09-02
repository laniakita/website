import type { FC } from 'react';
import Link from 'next/link';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { Category, Page, Post, Tag } from 'contentlayer/generated';
import BlogImageBlurServer from './img-blur-server';
import { Paragraph } from './paragraph';

export const globalMdxComponents = { p: Paragraph, img: BlogImageBlurServer, a: Link as unknown as FC };

export default function GlobalMDXComponent(data: Post | Page | Category | Tag) {
  const MDXContent = useMDXComponent(data.body.code);
  return <MDXContent code={data.body.code} components={globalMdxComponents} />;
}
