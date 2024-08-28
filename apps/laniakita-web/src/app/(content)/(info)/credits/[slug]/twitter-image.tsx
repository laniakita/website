import { ImageResponse } from 'next/og';
import ImageGenTwo from '@/components/image-gen-two';
import { allPages } from 'contentlayer/generated';

export const runtime = 'edge';

export default async function Image({params}: {params: {slug: string}}) {
  const logoSrc = await fetch(new URL('../../../../laniakita-logo-transparent-darkmode.png', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );
  const bgSrc = await fetch(new URL('../../../../noise_shader_01.png', import.meta.url)).then((res) => res.arrayBuffer());
  const interTightBlack = await fetch(new URL('../../../../InterTight-Black.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const interTightSemiBold = await fetch(new URL('../../../../InterTight-SemiBold.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  const credits = allPages.find((credit) => credit.url === `/credits/${params.slug}`);

  return new ImageResponse(
    <ImageGenTwo logo={logoSrc} bg={bgSrc} bgFormat='png' title={credits?.title} logoFormat='png' dynamic prefix='Credits' twitter />,
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
