import path from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeShiki from '@shikijs/rehype';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import type { Options } from '@mdx-js/loader';
import rehypeSlug from 'rehype-slug';

export const resMdxNoImgBundle = async (mdxStr: string, inputFolder: string) => {
  const folder = path.resolve(process.cwd(), inputFolder);
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        //@ts-expect-error -- false positive
        ...(options.rehypePlugins ?? []),
        [
          //@ts-expect-error -- false positive
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
        //@ts-expect-error -- false positive
        rehypeSlug,
        //@ts-expect-error -- false positive
        rehypeMdxImportMedia,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.png': 'dataurl',
        '.jpg': 'dataurl',
      };

      return options;
    },
  });
  const { code, frontmatter } = processed;
  return { code, frontmatter };
};

export const resMdxV3 = async (mdxStr: string, inputFolder: string, slug: string, folderName: string) => {
  const folder = path.resolve(process.cwd(), inputFolder);
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        //@ts-expect-error -- false positive
        ...(options.rehypePlugins ?? []),
        [
          //@ts-expect-error -- false positive
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
        //@ts-expect-error -- false positive
        rehypeSlug,
        //@ts-expect-error -- false positive
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

export const resMdx = async (mdxStr: string, folderName: string, slug: string) => {
  const folder = path.resolve(process.cwd(), `content/${folderName}`);
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        //@ts-expect-error -- false positive
        ...(options.rehypePlugins ?? []),
        [
          //@ts-expect-error -- false positive
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
        //@ts-expect-error -- false positive
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
