import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from 'rehype-highlight-code-lines';
import nix from 'highlight.js/lib/languages/nix';
import { common } from 'lowlight';
import { bundleMDX } from 'mdx-bundler';
import path from 'node:path';
import { Post } from 'content-collections';

export const postBundle = async (post: Post) =>
  await bundleMDX({
    file: path.join(process.cwd(), 'content/posts', post._meta.filePath),
    cwd: path.join(process.cwd(), 'content/posts', post._meta.directory),
    bundleDirectory: path.join(
      process.cwd(),
      'public/assets/bundles/blog',
      `${post._meta.fileName.split('.').shift()}`,
    ),
    bundlePath: `/${post._meta.fileName.split('.').shift()}/`,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypeHighlight, { languages: { ...common, nix } }],
        [
          rehypeHighlightLines,
          {
            showLineNumbers: true,
            lineContainerTagName: 'div',
          },
        ],
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
