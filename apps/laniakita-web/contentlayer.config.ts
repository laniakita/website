import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import { imageProcessor, FeaturedImageR1 } from './src/lib/image-process';
import jsxToHtml from './src/lib/mdx-html';

const CONTENT_DIR = 'content2';

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {type: 'string', required: true},
    description: {type: 'string', required: false}
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (page) => `/${page._raw.flattenedPath.split('/').slice(1, page._raw.flattenedPath.split('/').length).join('/')}`
    },
  }
}));

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
  computedFields: {
    url: {
      type: 'string',
      resolve: (tag) => `/${tag._raw.flattenedPath}`,
    },
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
  computedFields: {
    url: {
      type: 'string',
      resolve: (category) => `/${category._raw.flattenedPath}`,
    },
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
    html: {
      type: 'string',
      resolve: (post) => {
        const renderedMdx = jsxToHtml(post.body.code);
        return renderedMdx;
      }
    },
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post.id.split('-').shift()}/${post._raw.flattenedPath.split('/').pop()}`,
    },
    featured_image: {
      type: 'json',
      resolve: async (post): Promise<FeaturedImageR1> => {
        if (!post.imageSrc) return new FeaturedImageR1(false, '', '', 0, 0, '', '', null);
        const data = await imageProcessor({
            contentDir: CONTENT_DIR,
            prefix: `content2/${post._raw.flattenedPath}`,
            imgPath: post.imageSrc,
            debug: false,
          });
        
        const res = new FeaturedImageR1(true, data.src, data.base64, data.height, data.width, post.altText ?? '', post.caption ?? '', data._debug ?? null)
        return res
        //return { ...data, altText: post.altText ?? undefined, caption: post.caption ?? undefined };
      },
    },
  },
}));

export default makeSource({
  contentDirPath: CONTENT_DIR,
  documentTypes: [Post, Category, Tag, Page],
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
    esbuildOptions(options) {
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
