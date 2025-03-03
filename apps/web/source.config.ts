import { defineCollections, defineConfig, getDefaultMDXOptions } from 'fumadocs-mdx/config';
import path from 'node:path';
import * as z from 'zod';
import { descriptionHelper } from '@/lib/description-helper';
import remarkGfm from 'remark-gfm';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from 'rehype-highlight-code-lines';
import nix from 'highlight.js/lib/languages/nix';
import { common } from 'lowlight';
import matter from 'gray-matter';

// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

export const categories = defineCollections({
  dir: './content/categories',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      id: z.string().optional(),
      title: z.string().default('Category Page'),
      slug: z.string().default(`${ctx.path.split('/').pop()?.split('.').shift()?.toLowerCase()}`),
      type: z.string().default('category'),
      date: z.coerce.date().default(new Date()),
      url: z.string().default(`${ctx.path.split('content').pop()?.split('.').shift()?.toLowerCase()}`),
    });
  },
});

export const tags = defineCollections({
  dir: './content/tags',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      id: z.string().optional(),
      title: z.string().default('tag'),
      slug: z.string().default(`${ctx.path.split('/').pop()?.split('.').shift()?.toLowerCase()}`),
      type: z.string().optional(),
      date: z.coerce.date().default(new Date()),
      url: z.string().default(`${ctx.path.split('content').pop()?.split('.').shift()?.toLowerCase()}`),
    });
  },
});

export const authors = defineCollections({
  dir: './content/authors',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      date: z.coerce.date().default(new Date()),
      name: z.string(),
      bluesky: z.string().optional(),
      mastodon: z.string().optional(),
      github: z.string().optional(),
      url: z.string().default(`${ctx.path.split('content').pop()?.split('.').shift()}`),
    });
  },
});

export const pages = defineCollections({
  dir: './content/pages',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().default(new Date()),
      url: z.string().default(`${ctx.path.split('content').pop()?.split('.').shift()}`),
    });
  },
});

export const projects = defineCollections({
  type: 'doc',
  dir: './content/projects',
  schema: (ctx) => {
    return z.object({
      id: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      title: z.string(),
      tech: z.array(z.string()),
      imageSrc: z.string().optional(),
      altText: z.string().optional(),
      caption: z.string().optional(),
      description: z.string(),
      altDescription: z.string().optional(),
      blogPost: z.string().optional(),
      embedded: z.boolean(),
      foreignUrl: z.string().optional(),
      url: z.string().default(`${ctx.path.split('content').pop()?.split('.').shift()}`),
      featured_image: z
        .object({
          hasImage: z.boolean(),
          src: z.string(),
          base64: z.string(),
          height: z.number(),
          width: z.number(),
          resized: z.string(),
          altText: z.string(),
          caption: z.string(),
          _debug: z
            .object({
              destination: z.string(),
              status: z.object({
                exists: z.boolean(),
                existsInPublic: z.boolean(),
              }),
              didCopy: z.string(),
              reason: z.string(),
            })
            .or(z.null()),
        })
        .default({
          hasImage: false,
          src: '',
          base64: '',
          height: 0,
          width: 0,
          resized: '',
          altText: '',
          caption: '',
          _debug: null,
        }),
    });
  },
});

export const works = defineCollections({
  type: 'doc',
  dir: './content/works',
  schema: (ctx) => {
    return z.object({
      id: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      title: z.string(),
      domain: z.string(),
      active: z.boolean(),
      tech: z.array(z.string()),
      imageSrc: z.string().optional(),
      altText: z.string().optional(),
      url: z.string().default(`${ctx.path.split('content').pop()?.split('.').shift()}`),
      featured_image: z
        .object({
          hasImage: z.boolean(),
          src: z.string(),
          base64: z.string(),
          height: z.number(),
          width: z.number(),
          resized: z.string(),
          altText: z.string(),
          caption: z.string(),
          _debug: z
            .object({
              destination: z.string(),
              status: z.object({
                exists: z.boolean(),
                existsInPublic: z.boolean(),
              }),
              didCopy: z.string(),
              reason: z.string(),
            })
            .or(z.null()),
        })
        .default({
          hasImage: false,
          src: '',
          base64: '',
          height: 0,
          width: 0,
          resized: '',
          altText: '',
          caption: '',
          _debug: null,
        }),
    });
  },
});

const postSchema = (ctx: { path: string; source: string }) => {
  return z.object({
    id: z.string(),
    headline: z.string(),
    subheadline: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string(),
    imageSrc: z.string().optional(),
    altText: z.string().optional(),
    caption: z.string().optional(),
    catSlugs: z.array(z.string()).optional(),
    categories: z
      .array(z.object({ title: z.string().or(z.undefined()), url: z.string().or(z.undefined()), type: z.string() }))
      .default([{ title: undefined, url: undefined, type: 'category' }]),
    tagSlugs: z.array(z.string()).optional(),
    tags: z
      .array(z.object({ title: z.string(), url: z.string(), type: z.string() }))
      .default([{ title: '', url: '', type: 'tag' }]),
    keywords: z.array(z.string()).optional(),
    url: z.string().default(path.join('/blog', `${ctx.path.split('/').pop()?.split('.').shift()}`)),
    description: z.string().default(() => {
      const content = matter(ctx.source);
      return descriptionHelper(content.content) ?? 'Post description';
    }),
    featured_image: z
      .object({
        hasImage: z.boolean(),
        src: z.string(),
        base64: z.string(),
        height: z.number(),
        width: z.number(),
        resized: z.string(),
        altText: z.string(),
        caption: z.string(),
        _debug: z
          .object({
            destination: z.string(),
            status: z.object({
              exists: z.boolean(),
              existsInPublic: z.boolean(),
            }),
            didCopy: z.string(),
            reason: z.string(),
          })
          .or(z.null()),
      })
      .default({
        hasImage: false,
        src: '',
        base64: '',
        height: 0,
        width: 0,
        resized: '',
        altText: '',
        caption: '',
        _debug: null,
      }),
  });
};

export const blog = defineCollections({
  type: 'doc',
  dir: './content/posts',
  schema: postSchema,
});

export const blogFeed = defineCollections({
  type: 'doc',
  dir: './content/posts',
  schema: postSchema,
  mdxOptions: getDefaultMDXOptions({
    rehypeCodeOptions: false,
    remarkPlugins: (v) => [remarkGfm, ...v],
    rehypePlugins: (v) => [rehypeFnCitationSpacer, ...v],
  }),
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: false,
    remarkPlugins: (v) => [remarkGfm, ...v],
    rehypePlugins: (v) => [
      rehypeFnCitationSpacer,
      [rehypeHighlight, { languages: { ...common, nix } }],
      [
        rehypeHighlightLines,
        {
          showLineNumbers: true,
          lineContainerTagName: 'div',
        },
      ],
      ...v,
    ],
  },
});
