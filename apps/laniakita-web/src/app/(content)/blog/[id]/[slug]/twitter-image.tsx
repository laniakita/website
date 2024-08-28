import { ImageResponse } from 'next/og';
import ImageGenTwo from '@/components/image-gen-two';
import { allPosts } from 'contentlayer/generated';
import type { FeaturedImageR1 } from '@/lib/image-process';
import { BASE_URL } from '@/lib/constants';

export const runtime = 'edge';

export default async function Image({ params }: { params: { id: string; slug: string } }) {
  const logoSrc = await fetch(new URL('../../../../laniakita-logo-transparent-darkmode.png', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );
  const bgSrc = await fetch(new URL('../../../../noise_shader_01.png', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const interTightBlack = await fetch(new URL('../../../../InterTight-Black.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const interTightSemiBold = await fetch(new URL('../../../../InterTight-SemiBold.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const postData = allPosts.find(
    (postX) => postX.id.split('-').shift() === params.id && postX.url.split('/').pop() === params.slug,
  );

  return new ImageResponse(
    (postData?.featured_image as FeaturedImageR1).hasImage ? (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        {/* eslint-disable-next-line -- can't use Image component */}
        <img src={`${process.env.NODE_ENV === 'production' ? BASE_URL : 'http://localhost:3000'}${(postData?.featured_image as FeaturedImageR1).src}`} />
      </div>
    ) : (
      <ImageGenTwo
        logo={logoSrc}
        bg={bgSrc}
        bgFormat='png'
        title={postData?.headline}
        logoFormat='png'
        dynamic
        prefix="Lani's Dev Blog"
        twitter
      />
    ),
    {
      width: 1600,
      height: 900,
      fonts: [
        {
          name: 'InterTight',
          data: interTightBlack,
          style: 'normal',
          weight: 900,
        },
        {
          name: 'InterTight',
          data: interTightSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}
