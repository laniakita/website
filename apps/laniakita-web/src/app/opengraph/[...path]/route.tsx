import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import allPosts from 'contentlayermini/Post/index.json'
import allPages from 'contentlayermini/Page/index.json'
import allCategories from 'contentlayermini/Category/index.json'
import allTags from 'contentlayermini/Tag/index.json'
import ImageGenTwo from '@/components/image-gen-two';
import { allProjects } from 'contentlayer/generated';
import type { Project, Post, Page, Tag, Category } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const size = {
    width: 1200,
    height: 630,
  };

  const logoSrc = await fetch(new URL('../../laniakita-logo-transparent-darkmode.png', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const bgSrc = await fetch(new URL('../../noise_shader_01.jpg', import.meta.url)).then((res) => res.arrayBuffer());
  const interTightBlack = await fetch(new URL('../../InterTight-Black.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const zeroXProto = await fetch(new URL('../../0xProto-Regular.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

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

  return new ImageResponse(
    data.hasImage ? (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line -- can't use Image component */}
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
