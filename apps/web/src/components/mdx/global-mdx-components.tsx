import type { Category, Page, Post, Tag, Work } from 'contentlayer/generated';
import BlogImageBlurServer from './components/img-blur-server';
import { Paragraph } from './components/paragraph';
import { getMDXComponent } from './mdx-bundler-components';
//import { useMDXComponent } from 'next-contentlayer2/hooks';
//import Footnotes, { SupAnchors } from '../.tmp/section-footnotes';
import Anchors from './components/anchor-tags';
import PreCodeV2 from './components/pre-code/codeblock-v2';
import Section from './components/section/section';

export const globalMdxComponents = {
  p: Paragraph,
  img: BlogImageBlurServer,
  pre: PreCodeV2,
  a: Anchors,
  section: Section,
};

/*
  export default function GlobalMDXComponent(data: Post | Page | Category | Tag | Work) {
    const MDXContent = useMDXComponent(data.body.code);
    // @ts-expect-error -- types issue
    return <MDXContent components={globalMdxComponents} />;
  }
*/

export default function GlobalMDXComponent(data: Post | Page | Category | Tag | Work) {
  const MDXContent = getMDXComponent(data.body.code, {});
  return <MDXContent code={data.body.code} components={globalMdxComponents} />;
}

export function UniversalMDXComponent({ code }: { code: string }) {
  const MDXContent = getMDXComponent(code, {});
  return <MDXContent code={code} />;
}
