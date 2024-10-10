import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import type { Project } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';

export const maxDuration = 5;

export async function GET(request: NextRequest) {
  const size = {
    width: 1200,
    height: 630,
  };

  const logoData = await readFile(join(process.cwd(), 'laniakita-logo-transparent-darkmode.png'));
  const logoSrc = Uint8Array.from(logoData).buffer;

  const bgData = await readFile(join(process.cwd(), 'noise_shader_01.jpg'));
  const bgSrc = Uint8Array.from(bgData).buffer;

  const interData = await readFile(join(process.cwd(), 'inter-tight-latin-900-normal.woff'));
  const interTightBlack = Uint8Array.from(interData).buffer;

  const zeroXProtoData = await readFile(join(process.cwd(), '0xProto-Regular.woff'));
  const zeroXProto = Uint8Array.from(zeroXProtoData).buffer;

  const allProjectData = await readFile(join(process.cwd(), '.contentlayermini/generated/Project/index.json'), {
    encoding: 'utf8',
  });
  const allProjects = JSON.parse(allProjectData) as Project[];

  const validProjectPaths = allProjects.map((proj) => {
    return `/opengraph${proj.url.toLowerCase()}`;
  });
  const allValidPaths = [
    ...validProjectPaths,
  ];

  if (!allValidPaths.includes(request.nextUrl.pathname.toLowerCase())) {
    return new Response('Resource Not found.', { status: 404 });
  }

  // phase 2

  const reqType = request.nextUrl.pathname.split('/')[2];

  interface ResData {
    fetched: Project | null | undefined;
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
        data.fetched = allProjects.find((projX) => projX.url === projectUrl) as unknown as Project | undefined;
        data.type = 'projects';
        data.title = data.fetched?.title;
        data.prefix = 'Projects by Lani';
        // eslint-disable-next-line -- featured_image exists
        data.hasImage = data.fetched?.featured_image?.hasImage;
        break;
      }
      default: {
        console.error('Whoops, no data found!');
        break;
      }
    }
  } else if (reqType && !modUrl) {
    return new Response('Resource not found.', { status: 404 });
  }

  return new ImageResponse(
    data.hasImage && data.fetched?.featured_image !== undefined ? (
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
          src={(data.fetched.featured_image as FeaturedImageR1).resized}
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
          data: interTightBlack as ArrayBuffer,
          style: 'normal',
          weight: 900,
        },
        {
          name: '0xProto',
          data: zeroXProto as ArrayBuffer,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}

function ImageGenTwo({
  logo,
  logoFormat,
  bg,
  bgFormat,
  title,
  dynamic,
  prefix,
  twitter,
}: {
  logo: ArrayBuffer | ArrayBufferLike;
  logoFormat?: string;
  bg: ArrayBuffer | ArrayBufferLike;
  bgFormat?: string;
  title: string | undefined;
  dynamic?: boolean;
  prefix?: string;
  twitter?: boolean;
}) {
  const bgBase = Buffer.from(bg).toString('base64');
  const logoBase = Buffer.from(logo).toString('base64');
  const bgData = `data:image/${bgFormat ? bgFormat : 'png'};base64,${bgBase}`;
  const logoData = `data:image/${logoFormat ? logoFormat : 'png'};base64,${logoBase}`;
  if (title?.toLowerCase() === 'home') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'InterTight',
          backgroundColor: 'black',
        }}
      >
        <img
          src={bgData}
          style={{
            opacity: 0.8,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '-1rem',
          }}
        >
          <img src={logoData} alt='Logo for lanaiakita.com' style={{ height: '50%' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'InterTight',
        backgroundColor: 'black',
      }}
    >
      <img
        src={bgData}
        style={{
          opacity: 0.8,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          objectFit: 'cover',
        }}
      />

      {/* eslint-disable-next-line -- Image component can't be used here. */}
      <img src={logoData} height={`20%`} style={{ position: 'absolute', right: 30, top: 30 }} />

      {dynamic ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '-0.75rem',
            alignItems: 'flex-start',
            justifyContent: 'center',
            color: '#cdd6f4',
            padding: '1.25rem 3rem',
            backgroundColor: '#07070D',
            border: '0.15rem solid #1e1e2e',
            borderRadius: '0.375rem',
            maxWidth: '80%',
          }}
        >
          <h2
            style={{
              fontWeight: 400,
              fontFamily: '0xProto',
              fontSize: twitter ? 50 : 40,
            }}
          >
            {prefix}
          </h2>
          <div style={{ width: '100%', height: '0.15rem', backgroundColor: '#1e1e2e', borderRadius: '0.375rem' }} />
          <h1
            style={{
              display: 'flex',
              fontWeight: 900,
              fontSize: twitter ? 80 : 60,
              textWrap: title!.length > 14 ? 'balance' : 'wrap',
            }}
          >
            {title}
          </h1>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cdd6f4',
            padding: '1.25rem 3rem',
            backgroundColor: '#07070D',
            border: '0.15rem solid #1e1e2e',
            borderRadius: '0.375rem',
            maxWidth: '80%',
          }}
        >
          <h1 style={{ fontWeight: 900, fontSize: twitter ? 80 : 60 }}>{title}</h1>
        </div>
      )}
    </div>
  );
}
