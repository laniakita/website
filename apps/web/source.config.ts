import { defineCollections } from 'fumadocs-mdx/config';
import * as z from 'zod';

// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

export const categories = defineCollections({
  dir: './content/categories',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      id: z.string().optional(),
      title: z.string().default('Category Page'),
      slug: z.string().default('category-page'),
      type: z.string().default('category'),
      date: z.coerce.date().optional(),
      url: z.string().default(
        `/categories${ctx.path.split('.').shift()}`
      ),
    })
  },
});

export const tags = defineCollections({
  dir: './content/tags',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      id: z.string().optional(),
      title: z.string().default('tag'),
      slug: z.string().optional(),
      type: z.string().optional(),
      date: z.coerce.date().optional(),
      url: z.string().default(
        `/tags${ctx.path.split('.').shift()}`
      ),
    })
  },
});

export const authors = defineCollections({
  dir: './content/authors',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      name: z.string(),
      bluesky: z.string().optional(),
      mastodon: z.string().optional(),
      github: z.string().optional(),
      url: z.string().default(
        `/authors${ctx.path.split('.').shift()}`
      ),
    })
  },
});

export const pages = defineCollections({
  dir: './content/pages',
  type: 'doc',
  schema: (ctx) => {
    return z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
      url: z.string().default(
        `${ctx.path.split('.').shift()}`
      ),
    })
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
      url: z.string().default(() => {
        return `/projects${ctx.path.split('.').shift()}`
      }),
      featured_image: z.object({
        hasImage: z.boolean(),
        src: z.string(),
        base64: z.string(),
        height: z.number(),
        width: z.number(),
        resized: z.string(),
        altText: z.string(),
        caption: z.string(),
        _debug: z.object({
          destination: z.string(),
          status: z.object({
            exists: z.boolean(),
            existsInPublic: z.boolean()
          }),
          didCopy: z.string(),
          reason: z.string()
        }).or(z.null())
      }).default({
        hasImage: false,
        src: '',
        base64: '',
        height: 0,
        width: 0,
        resized: '',
        altText: '',
        caption: '',
        _debug: null
      })
    })
  }
});



export const blog = defineCollections({
  type: 'doc',
  dir: './content/posts',
  schema: (ctx) => {
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
      categories: z.array(z.object({ title: z.string(), url: z.string(), type: z.string() })).default([{ title: '', url: '', type: 'category' }]),
      tagSlugs: z.array(z.string()).optional(),
      tags: z.array(z.object({ title: z.string(), url: z.string(), type: z.string() })).default([{ title: '', url: '', type: 'tag' }]),
      keywords: z.array(z.string()).optional(),
      url: z.string().default(() => {
        return `/blog${ctx.path.split('.').shift()}`
      }),
      featured_image: z.object({
        hasImage: z.boolean(),
        src: z.string(),
        base64: z.string(),
        height: z.number(),
        width: z.number(),
        resized: z.string(),
        altText: z.string(),
        caption: z.string(),
        _debug: z.object({
          destination: z.string(),
          status: z.object({
            exists: z.boolean(),
            existsInPublic: z.boolean()
          }),
          didCopy: z.string(),
          reason: z.string()
        }).or(z.null())
      }).default({
        hasImage: false,
        src: '',
        base64: '',
        height: 0,
        width: 0,
        resized: '',
        altText: '',
        caption: '',
        _debug: null
      })
    })
  }
});


