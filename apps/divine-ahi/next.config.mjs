import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@shikijs/twoslash",
    ],
  },
  swcMinify: true,
};

const nextConfigFunction = async (phase, { defaultConfig }) => {
  const plugins = [];

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import('@serwist/next')).default({
      swSrc: 'src/app/sw.ts',
      swDest: 'public/sw.js',
    });
    plugins.push(withSerwist);

    const withMDX = (await import('@next/mdx')).default({
      options: {
        remarkPlugins: [(await import('remark-gfm')).default],
        rehypePlugins: [(await import('@shikijs/rehype')).default],
      },
    });
    plugins.push(withMDX);
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
      enabled: process.env.ANALYZE === 'true',
    });
    plugins.push(withBundleAnalyzer);
  }

  return plugins.reduce((acc, next) => next(acc), {
    ...defaultConfig,
    ...nextConfig,
  });
};

export default nextConfigFunction;
