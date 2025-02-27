/** @jsxImportSource react */
import type { ReactElement, DetailedHTMLProps, HTMLProps } from 'react';
import * as ReactDomServer from 'react-dom/server';
import { MDXContent } from '@content-collections/mdx/react';
import { bundleMDX } from 'mdx-bundler';
import type { Options } from '@mdx-js/loader';
import path from 'node:path';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer';

function Paragraph(props: DetailedHTMLProps<HTMLProps<HTMLParagraphElement>, HTMLParagraphElement>) {
  if (typeof props.children !== 'string' && (props.children as ReactElement).type === 'img') {
    return <>{props.children}</>;
  }
  return <p {...props} />;
}

const resMdx = async (mdxStr: string, contentDir: string, folderPath: string) => {
  const folder = path.resolve(process.cwd(), contentDir, folderPath);
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMdxImportMedia,
        rehypeSlug,
        rehypeFnCitationSpacer,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.outdir = `${process.cwd()}/public/assets/images/blog`;
      options.loader = {
        ...options.loader,
        '.png': 'file',
        '.jpg': 'file',
      };
      options.publicPath = `/assets/images/blog`;
      options.write = true;
      return options;
    },
  });
  const { code, frontmatter } = processed;
  return { code, frontmatter };
};

export default async function jsxToHtml(markdown: string, contentDir: string, folderPath: string) {
  const mdxCode = await resMdx(markdown, contentDir, folderPath);
  // @ts-expect-error -- ...types okay?
  const res5 = ReactDomServer.renderToStaticMarkup(<MDXContent code={mdxCode.code} components={{p: Paragraph}} />);
  return res5;
}