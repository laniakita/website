import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer2/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeShiki from '@shikijs/rehype';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import { imageProcessor } from './src/lib/image-process';

const CONTENT_DIR = 'content2';

const Tag = defineNestedType(() => ({
  name: 'Tag',
  fields: {
    title: { type: 'string', required: false },
  },
}));

const Category = defineNestedType(() => ({
  name: 'Category',
  fields: {
    title: { type: 'string', required: false}
  }
}));

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
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
    category: {
      type: 'nested',
      of: [Category, Tag],
    },
    imageSrc: {type: 'string', required: false}
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `content2/posts/${post._raw.flattenedPath}` },
    featured_image: { type: 'json', resolve: async (post) => {
        if (!post.imageSrc) return;
        const data = await imageProcessor({contentDir: CONTENT_DIR, prefix: 'assets', imgPath: post.imageSrc, debug: false})
        return data
      } 
    },

  },
}))

export default makeSource({ contentDirPath: CONTENT_DIR, documentTypes: [Post] })
