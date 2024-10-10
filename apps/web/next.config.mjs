import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { RESUME_LINK } from './src/lib/constants-js.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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

  /* replace webpack for next 15
  experimental: {
    turbo: {
      rules: {
        '*.vert': {
          loaders: ['raw-loader'],
          as: '*.js'
        },
        '*.frag': {
          loaders: ['raw-loader'],
          as: '*.js'
        },
      },
    },
  },
  */

  swcMinify: true,

  async redirects() {
    return [
      {
        source: '/blog/posts/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/feed.xml',
        destination: '/atom.xml',
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
        source: '/projects/credits/bot-clicker',
        destination: '/credits/bot-clicker',
        permanent: true,
      },
      {
        source: '/resume',
        destination: RESUME_LINK,
        permanent: true,
      },
    ];
  },
};

const nextConfigFunction = async (phase, { defaultConfig }) => {
  const plugins = [];

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import('@serwist/next')).default({
      swSrc: 'src/app/sw.ts',
      swDest: 'public/sw.js',
    });
    plugins.push(withSerwist);

    // ignore webpack cache warnings (see: https://github.com/contentlayerdev/contentlayer/issues/313)
    const withContentLayer = (await import('next-contentlayer2')).withContentlayer;
    plugins.push(withContentLayer);
  }

  const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
    enabled: process.env.ANALYZE === 'true',
  });
  plugins.push(withBundleAnalyzer);

  return plugins.reduce((acc, next) => next(acc), {
    ...defaultConfig,
    ...nextConfig,
  });
};

export default nextConfigFunction;
