import { bundleMDX } from 'mdx-bundler';
import type { Options } from '@mdx-js/loader';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from 'rehype-highlight-code-lines';

export const resMdxMinimal = async (mdxStr: string) => {
  const processed = await bundleMDX({
    source: mdxStr,
    mdxOptions(options: Options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHighlight,
        [
          rehypeHighlightLines,
          {
            showLineNumbers: true,
            lineContainerTagName: 'div',
          },
        ],
        rehypeSlug,
        rehypeFnCitationSpacer,
      ];
      return options;
    },
  });
  const { code, frontmatter } = processed;
  return { code, frontmatter };
};
