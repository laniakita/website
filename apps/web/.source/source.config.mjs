// source.config.ts
import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";
var category = defineCollections({
  dir: "./content/categories",
  type: "doc",
  schema: (ctx) => {
    return z.object({
      id: z.string().optional(),
      title: z.string(),
      slug: z.string().optional(),
      type: z.string().optional(),
      date: z.coerce.date().optional(),
      url: z.string().default(
        `/categories/${ctx.path.split(".").shift()}`
      )
    });
  }
});
var tag = defineCollections({
  dir: "./content/tags",
  type: "doc",
  schema: (ctx) => {
    return z.object({
      id: z.string().optional(),
      title: z.string(),
      slug: z.string().optional(),
      type: z.string().optional(),
      date: z.coerce.date().optional(),
      url: z.string().default(
        `/tags/${ctx.path.split(".").shift()}`
      )
    });
  }
});
var author = defineCollections({
  dir: "./content/authors",
  type: "doc",
  schema: (ctx) => {
    return z.object({
      name: z.string(),
      bluesky: z.string().optional(),
      mastodon: z.string().optional(),
      github: z.string().optional(),
      url: z.string().default(
        `/authors/${ctx.path.split(".").shift()}`
      )
    });
  }
});
var post = defineCollections({
  type: "doc",
  dir: "./content/posts",
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
      tagSlugs: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
      url: z.string().default(() => {
        return `/blog/${ctx.path.split(".").shift()}`;
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
        debug: z.object({
          destination: z.string(),
          status: z.object({
            exists: z.boolean(),
            existsInPublic: z.boolean()
          }),
          didCopy: z.string(),
          reason: z.string()
        }).or(z.null())
      }).optional()
    });
  }
});
export {
  author,
  category,
  post,
  tag
};
