import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import { imageProcessor } from './src/lib/image-process';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';

const CONTENT_DIR = 'content2';

const Tag = defineDocumentType(() => ({
  name: 'Tag',
  filePathPattern: 'tags/**/*.mdx',
  contentType: 'mdx',
  fields: {
    id: { type: 'string', required: false },
    title: { type: 'string', required: false },
    slug: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
}));

const Category = defineDocumentType(() => ({
  name: 'Category',
  filePathPattern: 'categories/**/*.mdx',
  contentType: 'mdx',
  fields: {
    id: { type: 'string', required: false },
    title: { type: 'string', required: false },
    slug: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
}));

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    id: { type: 'string', required: true },
    headline: { type: 'string', required: true },
    subheadline: { type: 'string', required: false },
    slug: { type: 'string', required: false },
    date: { type: 'date', required: true },
    author: { type: 'string', required: false },
    categories: {
      type: 'list',
      of: Category,
    },
    tags: {
      type: 'list',
      of: Tag,
    },
    imageSrc: { type: 'string', required: false },
    altText: { type: 'string', required: false },
    caption: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `blog2/${post.id?.split('-').shift()}/${post._raw.flattenedPath.split('/').pop()}`,
    },
    featured_image: {
      type: 'json',
      resolve: async (post) => {
        if (!post.imageSrc) return;
        const data = await imageProcessor({
          contentDir: CONTENT_DIR,
          prefix: `content2/${post._raw.flattenedPath}`,
          imgPath: post.imageSrc,
          debug: false,
        });
        return { ...data, altText: post.altText, caption: post.caption };
      },
    },
  },
}));

export default makeSource({
  contentDirPath: CONTENT_DIR,
  documentTypes: [Post, Category, Tag],
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
      //@ts-expect-error -- typeof(rehypeMdxImportMedia) !== Unified.Pluggable
      rehypeMdxImportMedia,
      rehypeSlug,
    ],
    resolveCwd: 'relative',
    esbuildOptions(options, frontmatter) {
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
  },
});
