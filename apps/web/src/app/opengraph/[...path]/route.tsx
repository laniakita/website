import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import type { Project, Post, Page, Tag, Category } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import ImageGenTwo from '@/components/image-gen-two';

export const runtime = 'edge';

export const maxDuration = 5;

export async function GET(request: NextRequest) {
  const size = {
    width: 1200,
    height: 630,
  };

  /* res.json was,
   * too easy, I guess. Fetching
   * it this way, "just works".
   * */

  const allPosts = await fetch(
    new URL('../../../scripts/dist/contentlayermini/generated/Post/index.json', import.meta.url),
  )
    .then((res) => res.arrayBuffer())
    .then((arr) => new Blob([arr]))
    .then((blob) => blob.text())
    .then((text) => JSON.parse(text) as Post[]);

  const allPages = await fetch(
    new URL('../../../scripts/dist/contentlayermini/generated/Page/index.json', import.meta.url),
  )
    .then((res) => res.arrayBuffer())
    .then((arr) => new Blob([arr]))
    .then((blob) => blob.text())
    .then((text) => JSON.parse(text) as Page[]);

  const allCategories = await fetch(
    new URL('../../../scripts/dist/contentlayermini/generated/Category/index.json', import.meta.url),
  )
    .then((res) => res.arrayBuffer())
    .then((arr) => new Blob([arr]))
    .then((blob) => blob.text())
    .then((text) => JSON.parse(text) as Category[]);

  const allTags = await fetch(
    new URL('../../../scripts/dist/contentlayermini/generated/Tag/index.json', import.meta.url),
  )
    .then((res) => res.arrayBuffer())
    .then((arr) => new Blob([arr]))
    .then((blob) => blob.text())
    .then((text) => JSON.parse(text) as Tag[]);

  const allProjects = await fetch(
    new URL('../../../scripts/dist/contentlayermini/generated/Project/index.json', import.meta.url),
  )
    .then((res) => res.arrayBuffer())
    .then((arr) => new Blob([arr]))
    .then((blob) => blob.text())
    .then((text) => JSON.parse(text) as Project[]);

  const logoSrc = await fetch(new URL('../../laniakita-logo-transparent-darkmode.png', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const bgSrc = await fetch(new URL('../../noise_shader_01.jpg', import.meta.url)).then((res) => res.arrayBuffer());
  const interTightBlack = await fetch(new URL('../../inter-tight-latin-900-normal.woff', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const zeroXProto = await fetch(new URL('../../0xProto-Regular.woff', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  const validPostPaths = allPosts.map((post) => {
    return `/opengraph${post.url.toLowerCase()}`;
  });
  const validPagePaths = allPages.map((page) => {
    // we need to find dynamic pages like '/credits/bot-clicker' too
    if (page.url.split('/').length > 2) {
      return `/opengraph${page.url}`;
    }
    return `/opengraph/static${page.url.toLowerCase()}`;
  });
  const validCategoryPaths = allCategories.map((cat) => {
    return `/opengraph${cat.url.toLowerCase()}`;
  });
  const validTagPaths = allTags.map((tag) => {
    return `/opengraph${tag.url.toLowerCase()}`;
  });
  const validProjectPaths = allProjects.map((proj) => {
    return `/opengraph${proj.url.toLowerCase()}`;
  });
  const allValidPaths = [
    '/opengraph/home',
    ...validPagePaths,
    ...validPostPaths,
    ...validCategoryPaths,
    ...validTagPaths,
    ...validProjectPaths,
  ];

  if (!allValidPaths.includes(request.nextUrl.pathname.toLowerCase())) {
    return new Response('Internal Server Error.', { status: 500 })
  };

  // phase 2

  const reqType = request.nextUrl.pathname.split('/')[2];

  interface ResData {
    fetched: Project | Post | Page | Tag | Category | null | undefined;
    title: string | null | undefined;
    prefix: string | null | undefined;
    type: string | null | undefined;
    hasImage: boolean;
    dynamic: boolean;
  }

  const data: ResData = {
    fetched: null,
    title: null,
    prefix: null,
    type: null,
    hasImage: false,
    dynamic: true,
  };

  const searchParams = request.nextUrl.searchParams;
  const isTwitter = searchParams.get('twitter') === 'true';
  if (isTwitter) {
    size.width = 1600;
    size.height = 900;
  }

  const modUrl = request.nextUrl.pathname.split('/').slice(3, request.nextUrl.pathname.split('/').length).join('/');
  if (modUrl || reqType === 'home' || (reqType === 'credits' && !modUrl)) {
    switch (reqType) {
      case 'projects': {
        const projectUrl = `/projects/${modUrl}`;
        data.fetched = allProjects.find((projX) => projX.url === projectUrl);
        data.type = 'projects';
        data.title = data.fetched?.title;
        data.prefix = 'Projects by Lani';
        // eslint-disable-next-line -- featured_image exists
        data.hasImage = data.fetched?.featured_image?.hasImage;
        break;
      }
      case 'blog': {
        const postUrl = `/blog/${modUrl}`;
        data.fetched = allPosts.find((postX) => postX.url === postUrl) as unknown as Post | undefined;
        data.type = 'blog';
        data.title = data.fetched?.headline;
        data.prefix = 'Dev Blog of Lani';
        // eslint-disable-next-line -- featured_image exists
        data.hasImage = data?.fetched?.featured_image?.hasImage;
        break;
      }
      case 'credits': {
        const creditUrl = `/credits/${modUrl}`;
        data.fetched = allPages.find((credit) => credit.url === creditUrl) as unknown as Page | undefined;
        data.type = 'credits';
        data.title = data.fetched?.title;
        data.prefix = 'Credits';
        break;
      }
      case 'tags': {
        const tagUrl = `/tags/${modUrl}`;
        data.fetched = allTags.find((tag) => tag.url === tagUrl) as unknown as Tag | undefined;
        data.type = 'tags';
        data.title = data.fetched?.title;
        data.prefix = 'Tags';
        break;
      }
      case 'categories': {
        const catUrl = `/categories/${modUrl}`;
        data.fetched = allCategories.find((cat) => cat.url === catUrl) as unknown as Category | undefined;
        data.type = 'categories';
        data.title = data.fetched?.title;
        data.prefix = 'Categories';
        break;
      }
      case 'static': {
        const staticUrl = `/${modUrl}`;
        data.fetched = allPages.find((page) => page.url === staticUrl) as unknown as Page | undefined;
        data.type = 'static';
        data.title = data.fetched?.title;
        data.dynamic = false;
        break;
      }
      case 'home': {
        data.type = 'static';
        data.title = 'Home';
        data.dynamic = false;
        break;
      }
      default: {
        console.error('Whoops, no data found!');
        break;
      }
    }
  } else if (reqType && !modUrl) {
    return new Response('Internal Server Error.', { status: 500 });
  }

  return new ImageResponse(
    data.hasImage && (data.fetched as Post | Project).featured_image !== undefined ? (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- image generator, not html. */}
        <img
          style={{
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
          src={((data.fetched as Post | Project).featured_image as FeaturedImageR1).resized}
        />
      </div>
    ) : (
      <ImageGenTwo
        logo={logoSrc}
        bg={bgSrc}
        bgFormat='jpeg'
        title={data.title ?? ''}
        logoFormat='png'
        dynamic={data.dynamic}
        prefix={data.prefix ?? ''}
        twitter={isTwitter}
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: 'InterTight',
          data: interTightBlack,
          style: 'normal',
          weight: 900,
        },
        {
          name: '0xProto',
          data: zeroXProto,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
