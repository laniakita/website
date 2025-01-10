'use server'
import React, { ReactElement, ReactNode } from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import * as _jsx_dev_runtime from 'react/jsx-dev-runtime';
import * as ReactDOM from 'react-dom';
import { bundleMDX } from 'mdx-bundler';
import type { Options } from '@mdx-js/loader';
import path from 'node:path';
import remarkGfm from 'remark-gfm';
import rehypeMultiRefs from '@/utils/rehype-multi-refs/lib';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';
/*
 * It was necessary to recreate the helper MDX components, because
 * I can't import other components properly. This is due to these
 * functions being imported via the contentlayer.config.ts.
 *
 * As well, since this is destined for feed readers, it might be
 * better to omit the replacement <img /> component in this 'EZ'
 * re-creation. Because the resultant markup is more "vanilla".
 * */

export const resMdx = async (mdxStr: string, contentDir: string, folderPath: string) => {
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
        rehypeMultiRefs
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

function Paragraph(props: { children?: ReactNode }) {
  if (typeof props.children !== 'string' && (props.children as ReactElement).type === 'img') {
    return <>{props.children}</>;
  }
  return <p {...props} />;
}

function EzMdx({ mdxCode }: { mdxCode: string; }) {
  const mdxComponents = { p: Paragraph };
  const Component = getMDXComponent(mdxCode, {});
  return <Component code={mdxCode} components={mdxComponents} />;
}

async function jsxToHtml(markdown: string, contentDir: string, folderPath: string) {
  'use server'
  const ReactDomServer = (await import('react-dom/server')).default;
  const mdxCode = await resMdx(markdown, contentDir, folderPath)
  const component = <EzMdx mdxCode={mdxCode.code} />;
  const res =  ReactDomServer.renderToStaticMarkup(component);
  return res;
}

function getMDXComponent(code: string, globals: Record<string, unknown>) {
  const mdxExport = getMDXExport(code, globals);
  return mdxExport.default;
}

function getMDXExport(code: string, globals: Record<string, unknown>) {
  const scope = {
    React,
    ReactDOM,
    _jsx_runtime: process.env.NODE_ENV === 'production' ? _jsx_runtime : _jsx_dev_runtime,
    ...globals,
  };
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope));
}

export default jsxToHtml;
