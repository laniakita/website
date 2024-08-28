import { readFile } from 'node:fs/promises'
import {dirname, join} from 'node:path'
import { fileURLToPath } from 'node:url';
import { ImageResponse } from 'next/og';
import { imageBase64 } from '@/lib/better-blurs';
import DynamicImageGen from '@/components/dynamic-image-gen';
import { allPages } from 'contentlayer/generated';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoStr = await imageBase64(join(__dirname, '../../../../laniakita-logo-transparent-darkmore.png'))
const bgStr = await imageBase64(join(__dirname, '../../../../noise_shader_01.png'))

export default async function Image({ params }: { params: { slug: string } }) {
  const credits = allPages.find((credit) => credit.url === `/credits/${params.slug}`);

  return new ImageResponse(
    (
      <DynamicImageGen logoStr={logoStr} bgStr={bgStr} title={credits?.title ?? 'Credit'} prefix='Credits:' />
    ),
    {
      width: 1200,
      height: 630,
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
