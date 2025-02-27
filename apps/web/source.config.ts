import slugify from '@/utils/slugify';
import { defineCollections } from 'fumadocs-mdx/config';
import * as z from 'zod';
//import { createDefaultImport, defineCollections, defineConfig } from '@content-collections/core';
import util from 'node:util';
import { exec as exec_process } from 'node:child_process';
import { imageProcessor, FeaturedImageR1 } from './src/lib/image-process';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from 'rehype-highlight-code-lines';
import nix from 'highlight.js/lib/languages/nix';
import { common } from 'lowlight';
import path from 'node:path';
import { compileMDX } from '@content-collections/mdx';
import { HtmlCode } from '@/scripts/html-gen';
import { MDXContentProps } from 'mdx-bundler/dist/types';

const exec = util.promisify(exec_process);



// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

const categories = defineCollections({
  dir: './content/categories',
  type: 'doc',
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    slug: z.string().optional(),
    type: z.string().optional(),
    date: z.coerce.date().optional(),
    url: z.string().optional(),
  }),
  transform: async (document, context) => {
    const urlRes = `/categories/${document._meta.path}`;
    const mdx = await compileMDX(context, document);

    const lastModified = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);
      if (stdout) {
        return new Date(stdout.trim()).toISOString();
      }
      return new Date().toISOString();
    });

    return {
      ...document,
      mdx,
      url: urlRes,
      lastModified,
    };
  },
});

const tags = defineCollections({
  dir: './content/tags',
  type: 'doc',
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    slug: z.string().optional(),
    type: z.string().optional(),
    date: z.coerce.date().optional(),
    url: z.string().optional(),
  }),
  transform: async (document, context) => {
    const urlRes = `/tags/${document._meta.path}`;
    const mdx = await compileMDX(context, document);

    const lastModified = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);
      if (stdout) {
        return new Date(stdout.trim()).toISOString();
      }
      return new Date().toISOString();
    });

    return {
      ...document,
      mdx,
      url: urlRes,
      lastModified,
    };
  },
});

const authors = defineCollections({
  name: 'authors',
  dir: './content/authors',
  type: 'doc',
  schema: z.object({
    name: z.string(),
    bluesky: z.string().optional(),
    mastodon: z.string().optional(),
    github: z.string().optional(),
    url: z.string().optional(),
  }),
  transform: async (document, context) => {
    const slug = slugify(document.name);
    const mdx = await compileMDX(context, document);

    const urlRes = `/${document._meta.path}`;

    const lastModified = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);
      if (stdout) {
        return new Date(stdout.trim()).toISOString();
      }
      return new Date().toISOString();
    });

    return {
      ...document,
      mdx,
      slug,
      url: urlRes,
      lastModified,
    };
  },
});

const posts = defineCollections({
  dir: './content/posts',
  type: 'doc',
  //parser: 'frontmatter-only',
  schema: z.object({
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
    url: z.string().optional(),
  }),
  transform: async (document, context) => {
    const urlRes = `/blog/${document._meta.fileName.split('.').shift()}`;
    const mdxContent = createDefaultImport<MDXContentProps>(`@content/posts/${document._meta.filePath}`);
    
    //const url = path.join('file://', process.cwd(), 'content/posts/', document._meta.filePath)

    //const html = await htmlGenS(document.content, url)
    /*
    const body = await compileMDX(context, document, {
      cwd: path.join(process.cwd(), 'content/posts', document._meta.dir)
    });
    */
    const categoriesRes =
      document.catSlugs &&
      (await Promise.all(
        document.catSlugs.map(async (cat) => {
          const found = await context.documents(categories).find((category) => category._meta.path === cat);
          if (found) {
            return {
              title: found.title,
              url: found.url,
              type: found.type,
            };
          }
        }),
      ));

    const tagsRes =
      document.tagSlugs &&
      (await Promise.all(
        document.tagSlugs.map(async (tag) => {
          const found = await context.documents(tags).find((_tag) => _tag._meta.path === tag);

          if (found) {
            return {
              title: found.title,
              url: found.url,
              type: found.type,
            };
          }
        }),
      ));

    const imgData =
      document.imageSrc &&
      (await imageProcessor({
        contentDir: 'content',
        prefix: `content/posts/${document._meta.filePath}`,
        imgPath: document.imageSrc,
        debug: false,
      }));

    const res = imgData
      ? new FeaturedImageR1(
          true,
          imgData.src,
          imgData.base64,
          imgData.height,
          imgData.width,
          imgData.resized,
          document.altText ?? '',
          document.caption ?? '',
          imgData._debug ?? null,
        )
      : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

    const featured_image_res = JSON.stringify(res);

    return {
      ...document,
      //content: mdx.matter.content,
      //mdx: mdx.code,
      mdxContent: JSON.stringify(mdxContent),
      url: urlRes,
      featured_image: JSON.parse(featured_image_res),
      categories: categoriesRes,
      tags: tagsRes,
    };
  },
});

const pages = defineCollections({
  name: 'pages',
  dir: './content/pages',
  type: 'doc',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
  transform: async (document, context) => {
    const urlRes = `/${document._meta.path}`;
    const mdx = await compileMDX(context, document);

    return {
      ...document,
      mdx,
      url: urlRes,
    };
  },
});

const projects = defineCollections({
  dir: './content/projects',
  type: 'meta',
  schema: z.object({
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
  }),
  transform: async (document) => {
    const urlRes = `/projects/${document._meta.filePath.split('.').shift()}`;

    const imgData =
      document.imageSrc &&
      (await imageProcessor({
        contentDir: 'content',
        prefix: `content/projects/${document._meta.filePath}`,
        imgPath: document.imageSrc,
        debug: false,
      }));

    const res = imgData
      ? new FeaturedImageR1(
          true,
          imgData.src,
          imgData.base64,
          imgData.height,
          imgData.width,
          imgData.resized,
          document.altText ?? '',
          document.caption ?? '',
          imgData._debug ?? null,
        )
      : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

    const featured_image_res = JSON.stringify(res);

    return {
      ...document,
      url: urlRes,
      featured_image: JSON.parse(featured_image_res),
    };
  },
});

const works = defineCollections({
  dir: './content/works',
  type: 'doc',
  schema: z.object({
    id: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    title: z.string(),
    domain: z.string(),
    active: z.boolean(),
    tech: z.array(z.string()),
    imageSrc: z.string().optional(),
    altText: z.string().optional(),
  }),
  transform: async (document) => {
    const urlRes = `/works/${document._meta.path}`;

    const mdx = await bundleMDX({
      file: path.join(process.cwd(), 'content/works', document._meta.filePath),
      cwd: path.join(process.cwd(), 'content/works', document._meta.dir),
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          [rehypeHighlight, { languages: { ...common, nix } }],
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

    const imgData =
      document.imageSrc &&
      (await imageProcessor({
        contentDir: 'content',
        prefix: `content/works/${document._meta.filePath}`,
        imgPath: document.imageSrc,
        debug: false,
      }));

    const res = imgData
      ? new FeaturedImageR1(
          true,
          imgData.src,
          imgData.base64,
          imgData.height,
          imgData.width,
          imgData.resized,
          document.altText ?? '',
          '',
          imgData._debug ?? null,
        )
      : new FeaturedImageR1(false, '', '', 0, 0, '', '', '', null);

    const featured_image_res = JSON.stringify(res);

    return {
      ...document,
      content: mdx.matter.content,
      mdx: mdx.code,
      url: urlRes,
      featured_image: JSON.parse(featured_image_res),
    };
  },
});

export default defineConfig({
  collections: [categories, tags, authors, posts, pages, projects, works],
});
