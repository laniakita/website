import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { MAIN_SITE_URL } from './src/lib/constants-js.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

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

  // needed for open-next build
  output: 'standalone',

  swcMinify: true,

  async redirects() {
    return [
      {
        source: '/',
        destination: `${MAIN_SITE_URL}/`,
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
