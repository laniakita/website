import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  experimental: {
    serverComponentsExternalPackages: ['@shikijs/twoslash', 'sharp'],
  },
  webpack(config) {
    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    config.experiments = {
      layers: true,
      futureDefaults: true,
    };

    return config;
  },
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
    ];
  },
};

const nextConfigFunction = async (phase, { defaultConfig }) => {
  if (process.env.CLOUDFLARE_PAGES_DEV === true) {
    await setupDevPlatform();
  }

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
