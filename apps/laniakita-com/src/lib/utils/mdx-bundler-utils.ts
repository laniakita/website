import path from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeShiki from '@shikijs/rehype';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import type { Options } from '@mdx-js/loader';

export const resMdx = async (mdxStr: string, folderName: string, slug: string) => {
  const folder = path.resolve(process.cwd(), `content/${folderName}`);
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options, frontmatter?: Record<string, any>) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [
          rehypeShiki,
          {
            themes: {
              light: 'catppuccin-latte',
              dark: 'catppuccin-mocha',
            },

            transformers: [
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererRich(),
              }),
            ],
          },
        ],
        rehypeMdxImportMedia,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.outdir = `${process.cwd()}/public/assets/images/${folderName}/${slug}`;
      options.loader = {
        ...options.loader,
        '.png': 'file',
        '.jpg': 'file',
      };
      options.publicPath = `/assets/images/${folderName}/${slug}`;
      options.write = true;
      return options;
    },
  });
  const { code, frontmatter } = processed;
  return { code, frontmatter };
};
