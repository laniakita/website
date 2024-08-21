import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeShiki from '@shikijs/rehype';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import { imageProcessor } from './src/lib/image-process';

interface FeaturedImage {
  url: string;
  blur: string;
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
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
      rehypeSlug,
      rehypeMdxImportMedia
    ],
  },
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    imageSrc: {type: 'string', required: false}
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
    featured_image: { type: 'json', resolve: async (post) => {
        if (!post.imageSrc) return;
        const data = await imageProcessor({prefix: 'posts', imgPath: post.imageSrc})
        return data
      } 
    },

  },
}))

export default makeSource({ contentDirPath: 'posts', documentTypes: [Post] })
