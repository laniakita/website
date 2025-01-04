import type { FC } from 'react';
import Link from 'next/link';
import type { Category, Page, Post, Tag, Work } from 'contentlayer/generated';
import BlogImageBlurServer from './img-blur-server';
import { Paragraph } from './paragraph';
import { getMDXComponent } from './mdx-bundler-components';
//import { useMDXComponent } from 'next-contentlayer2/hooks';
import CodeBlockCopier from './codeblock-copier';
import Footnotes, {SupAnchors} from './section-footnotes';
import Anchors from './anchor-tags';

export const globalMdxComponents = {
  p: Paragraph,
  img: BlogImageBlurServer,
  a: Anchors,
  pre: CodeBlockCopier,
  section: Footnotes,
  sup: SupAnchors,
};

/*
export default function GlobalMDXComponent(data: Post | Page | Category | Tag | Work) {
  const MDXContent = useMDXComponent(data.body.code);
  // @ts-expect-error -- types issue
  return <MDXContent components={globalMdxComponents} />
}*/

export default function GlobalMDXComponent(data: Post | Page | Category | Tag | Work) {
  const MDXContent = getMDXComponent(data.body.code, {});
  return <MDXContent code={data.body.code} components={globalMdxComponents} />;
}
