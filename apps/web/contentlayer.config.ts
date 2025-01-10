import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import nix from 'highlight.js/lib/languages/nix';
import { common } from 'lowlight';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from 'rehype-highlight-code-lines';
import { imageProcessor, FeaturedImageR1 } from './src/lib/image-process';
import jsxToHtml from './src/lib/mdx-html';
import rehypeMultiRefs from '@/utils/rehype-multi-refs/lib';

export const CONTENT_DIR = 'content';

export const Work = defineDocumentType(() => ({
  name: 'Work',
  filePathPattern: 'works/**/*.mdx',
  contentType: 'mdx',
  fields: {
    id: { type: 'string', required: true },
    startDate: { type: 'date', required: true },
    endDate: { type: 'date', required: false },
    title: { type: 'string', required: true },
    domain: { type: 'string', required: true },
    active: { type: 'boolean', required: true },
    tech: {
      type: 'list',
      of: { type: 'string' },
    },
    imageSrc: { type: 'string', required: false },
    altText: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (work) => `/${work._raw.flattenedPath}`,
    },
    featured_image: {
      type: 'json',
      resolve: async (work): Promise<FeaturedImageR1> => {
        if (!work.imageSrc) return new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);
        const data = await imageProcessor({
          contentDir: CONTENT_DIR,
          prefix: `${CONTENT_DIR}/${work._raw.flattenedPath}`,
          imgPath: work.imageSrc,
          debug: false,
        });

        const res = new FeaturedImageR1(
          true,
          data.src,
          data.base64,
          data.height,
          data.width,
          data.resized,
          work.altText ?? '',
          '',
          data._debug ?? null,
        );

        return res;
      },
    },
  },
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.yaml',
  contentType: 'data',
  fields: {
    id: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updated: { type: 'date', required: false },
    title: { type: 'string', required: true },
    tech: {
      type: 'list',
      of: { type: 'string' },
    },
    imageSrc: { type: 'string', required: false },
    altText: { type: 'string', required: false },
    caption: { type: 'string', required: false },
    description: { type: 'string', required: true },
    blogPost: { type: 'string', required: false },
    embedded: { type: 'boolean', required: true },
    foreignUrl: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (project) => `/${project._raw.flattenedPath}`,
    },
    featured_image: {
      type: 'json',
      resolve: async (project): Promise<FeaturedImageR1> => {
        if (!project.imageSrc) return new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);
        const data = await imageProcessor({
          contentDir: CONTENT_DIR,
          prefix: `${CONTENT_DIR}/${project._raw.flattenedPath}`,
          imgPath: project.imageSrc,
          debug: false,
        });

        const res = new FeaturedImageR1(
          true,
          data.src,
          data.base64,
          data.height,
          data.width,
          data.resized,
          project.altText ?? '',
          project.caption ?? '',
          data._debug ?? null,
        );

        return res;
      },
    },
  },
}));

export const Author = defineDocumentType(() => ({
  name: 'Author',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    mastodon: { type: 'string', required: false },
    github: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (author) => `/${author._raw.flattenedPath}`,
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (page) =>
        `/${page._raw.flattenedPath.split('/').slice(1, page._raw.flattenedPath.split('/').length).join('/')}`,
    },
  },
}));

const Tag = defineDocumentType(() => ({
  name: 'Tag',
  filePathPattern: 'tags/**/*.mdx',
  contentType: 'mdx',
  fields: {
    id: { type: 'string', required: false },
    title: { type: 'string', required: true },
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
    title: { type: 'string', required: true },
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
    updated: { type: 'date', required: false },
    author: { type: 'string', required: false },
    categories: {
      type: 'list',
      of: Category,
    },
    tags: {
      type: 'list',
      of: Tag,
    },
    keywords: {
      type: 'list',
      of: { type: 'string' },
    },
    imageSrc: { type: 'string', required: false },
    altText: { type: 'string', required: false },
    caption: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post.id.split('-').shift()}/${post._raw.flattenedPath.split('/').pop()}`,
    },
    featured_image: {
      type: 'json',
      resolve: async (post): Promise<FeaturedImageR1> => {
        if (!post.imageSrc) return new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);
        const data = await imageProcessor({
          contentDir: CONTENT_DIR,
          prefix: `${CONTENT_DIR}/${post._raw.flattenedPath}`,
          imgPath: post.imageSrc,
          debug: false,
        });

        const res = new FeaturedImageR1(
          true,
          data.src,
          data.base64,
          data.height,
          data.width,
          data.resized,
          post.altText ?? '',
          post.caption ?? '',
          data._debug ?? null,
        );
        return res;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: CONTENT_DIR,
  documentTypes: [Post, Category, Tag, Page, Project, Author, Work],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
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
      rehypeMultiRefs,
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
