import { bundleMDX } from 'mdx-bundler';
import type { Options } from '@mdx-js/loader';
import path from 'node:path';
import remarkGfm from 'remark-gfm';
import rehypeMultiRefs from '@/utils/rehype-multi-refs/lib';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';

export const resMdx = async (mdxStr: string, contentDir: string, folderPath: string) => {
  const folder = path.resolve(process.cwd(), contentDir, folderPath);
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeMdxImportMedia, rehypeSlug, rehypeMultiRefs];
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
