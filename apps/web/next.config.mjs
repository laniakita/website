import path from 'node:path';
import { fileURLToPath } from 'url';
import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { RESUME_LINK, SHOWCASE_URL } from './src/lib/constants-js.mjs';
import { createMDX } from 'fumadocs-mdx/next';

//import { withContentCollections } from '@content-collections/next';

/*
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypeSlug from 'rehype-slug';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer';
import rehypeHighlight from 'rehype-highlight';
import rehypeHighlightLines from 'rehype-highlight-code-lines';
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import nix from 'highlight.js/lib/languages/nix';
import { common } from 'lowlight';*/

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    loader: 'custom',
    // loader for cloudfront during deploy & loader for local development.
    loaderFile:
      process.env.NEXT_PUBLIC_DEPLOYED_URL !== undefined && process.env.NODE_ENV === 'production'
        ? './src/lib/image-loader.ts'
        : './src/lib/local-loader.ts',
    remotePatterns: [
      process.env.NEXT_PUBLIC_DEPLOYED_URL !== undefined && process.env.NODE_ENV === 'production'
        ? {
            protocol: 'https',
            hostname: '**.laniakita.com',
            port: '',
          }
        : {
            protocol: 'http',
            hostname: 'localhost',
          },
    ],
  },

  webpack(config) {
    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },

  // needed for open-next build
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),

  
  experimental: {
    turbo: {
      rules: {
        '*.vert': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
        '*.frag': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },

  async redirects() {
    return [
      {
        source: '/feed.xml',
        destination: '/atom.xml',
        permanent: true,
      },
      {
        source: '/blog/posts/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/blog/438e83f7/how-i-built-my-own-cms',
        destination: `/blog/438e83f7/how-i-built-my-own-cms-complete`,
        permanent: true,
      },
      {
        source: '/blog/tags/d5f3af56/meta',
        destination: '/categories/meta',
        permanent: true,
      },
      {
        source: '/blog/tags/c6857539/full-stack',
        destination: '/tags/full-stack',
        permanent: true,
      },
      {
        source: '/projects/bot-clicker',
        destination: `${SHOWCASE_URL}/projects/bot-clicker`,
        permanent: true,
      },
      {
        source: '/projects/credits/bot-clicker',
        destination: '/credits/bot-clicker',
        permanent: true,
      },
      {
        source: '/resume',
        destination: RESUME_LINK,
        permanent: false,
      },
      {
        source: '/lani-akita_resume-october-2024.pdf',
        destination: RESUME_LINK,
        permanent: true,
      },
      {
        source: '/lani-akita_resume-november-2024.pdf',
        destination: RESUME_LINK,
        permanent: true,
      },
      {
        source: '/lani-akita_resume-december-2024.pdf',
        destination: RESUME_LINK,
        permanent: true,
      },
    ];
  },
};

const nextConfigFunction = async ({ defaultConfig, phase }) => {
  const plugins = [];

  if (phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import('@serwist/next')).default({
      swSrc: 'src/app/sw.ts',
      swDest: 'public/sw.js',
      maximumFileSizeToCacheInBytes: 7864000,
    });
    plugins.push(withSerwist);
  }

  // ignore webpack cache warnings (see: https://github.com/contentlayerdev/contentlayer/issues/313)
  //const withContentLayer = (await import('next-contentlayer2')).withContentlayer;
  //plugins.push(withContentLayer);

  const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
    enabled: process.env.ANALYZE === 'true',
  });
  plugins.push(withBundleAnalyzer);

  /*
  const withMdx = createMDX({
    options:  {
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
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
        rehypeFnCitationSpacer,
      ],
    },
  });

  plugins.push(withMdx);

  */
  
  // needs to be last plugin in chain (see: https://github.com/sdorra/content-collections/issues/472#issuecomment-2607096538)
  //plugins.push(withContentCollections);
  
  
  const withMDX = createMDX({
    configPath: './source.config.ts',
  });
  plugins.push(withMDX)

  return plugins.reduce((acc, next) => next(acc), {
    ...defaultConfig,
    ...nextConfig,
  });
};

export default nextConfigFunction;
