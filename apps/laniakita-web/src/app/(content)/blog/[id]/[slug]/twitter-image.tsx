import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImageResponse } from 'next/og';
import { imageBase64 } from '@/lib/better-blurs';
import DynamicImageGen from '@/components/dynamic-image-gen';
import { allPosts } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoStr = await imageBase64(join(__dirname, '../../../../laniakita-logo-transparent-darkmore.png'));
const bgStr = await imageBase64(join(__dirname, '../../../../noise_shader_01_wide.png'));

export default async function Image({ params }: { params: { id: string; slug: string } }) {
  const postData = allPosts.find(
    (postX) => postX.id.split('-').shift() === params.id && postX.url.split('/').pop() === params.slug,
  );

  if ((postData?.featured_image as FeaturedImageR1).hasImage) {
    const featured = (
      await imageBase64(join(__dirname, `../../../../../../public${(postData?.featured_image as FeaturedImageR1).src}`))
    );
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* eslint-disable-next-line -- image component isn't posible here. */}
          <img
            src={featured.base64}
            alt={(postData?.featured_image as FeaturedImageR1).altText}
            height={featured.height}
            width={featured.width}
            style={{
              display: 'flex',
              objectFit: 'cover'
            }}
          />
        </div>
      ),
      {
        width: 1600,
        height: 900,
        fonts: [
          {
            name: 'InterTight',
            data: await readFile(join(__dirname, '../../../../InterTight-Black.ttf')),
            style: 'normal',
            weight: 900,
          },
          {
            name: 'InterTight',
            data: await readFile(join(__dirname, '../../../../InterTight-SemiBold.ttf')),
            style: 'normal',
            weight: 600,
          },
        ],
      },
    );
  }

  return new ImageResponse(
    <DynamicImageGen logoStr={logoStr} bgStr={bgStr} title={postData?.headline ?? 'Blog Post'} prefix='Blog:' />,
    {
      width: 1600,
      height: 900,
      fonts: [
        {
          name: 'InterTight',
          data: await readFile(join(__dirname, '../../../../InterTight-Black.ttf')),
          style: 'normal',
          weight: 900,
        },
        {
          name: 'InterTight',
          data: await readFile(join(__dirname, '../../../../InterTight-SemiBold.ttf')),
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}
