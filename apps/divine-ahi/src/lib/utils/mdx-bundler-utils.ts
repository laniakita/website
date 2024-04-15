import path from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeShiki from '@shikijs/rehype';
import type { Options } from '@mdx-js/loader'; 

export const resMdx = async (mdxStr: string, folderName: string) => {
  const folder = path.resolve(process.cwd(), `src/content/${folderName}`)
  const processed = await bundleMDX({
    source: mdxStr,
    cwd: folder,
    mdxOptions(options: Options, frontmatter?: Record<string, any>) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm]
      options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeShiki, rehypeMdxImportMedia]
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.png': 'dataurl',
        '.jpg': 'dataurl'
      };
      return options;
    },
  });
  const {code, frontmatter} = processed
  return {code, frontmatter};
};
