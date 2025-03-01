import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { blog, categories, tags } from '$/.source';

export const blogPosts = loader({
  baseUrl: '/posts',
  source: createMDXSource(blog),
});

export const category = loader({
  baseUrl: '/categories',
  source: createMDXSource(categories),
});

export const tag = loader({
  baseUrl: '/tags',
  source: createMDXSource(tags),
})


