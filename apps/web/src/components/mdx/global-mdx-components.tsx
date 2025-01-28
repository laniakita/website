import type { Category, Page, Post, Tag, Work } from 'contentlayer/generated';
import BlogImageBlurServer from './img-blur-server';
import { Paragraph } from './paragraph';
import { getMDXComponent } from './mdx-bundler-components';
//import { useMDXComponent } from 'next-contentlayer2/hooks';
import Footnotes, { SupAnchors } from './section-footnotes';
import Anchors from './anchor-tags';
import PreCodeV2 from './pre-code/codeblock-v2';

export const globalMdxComponents = {
  p: Paragraph,
  img: BlogImageBlurServer,
  a: Anchors,
  pre: PreCodeV2,
  section: Footnotes,
  sup: SupAnchors,
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

export function MiniMDXComponent({ code }: { code: string }) {
  const MDXContent = getMDXComponent(code, {});
  return <MDXContent code={code} />;
}
