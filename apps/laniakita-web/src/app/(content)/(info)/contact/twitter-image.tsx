import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImageResponse } from 'next/og';
import ImageGen from '@/components/non-dynamic-image-gen';
import { imageBase64 } from '@/lib/better-blurs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoStr = await imageBase64(join(__dirname, '../../../laniakita-logo-transparent-darkmore.png'));
const bgStr = await imageBase64(join(__dirname, '../../../noise_shader_01_wide.png'));

export default async function GET() {
  return new ImageResponse(<ImageGen logoStr={logoStr} bgStr={bgStr} title='Contact Lani' />, {
    width: 1600,
    height: 900,
    fonts: [
      {
        name: 'InterTight',
        data: await readFile(join(__dirname, '../../../InterTight-Black.ttf')),
        style: 'normal',
        weight: 900,
      },
      {
        name: 'InterTight',
        data: await readFile(join(__dirname, '../../../InterTight-SemiBold.ttf')),
        style: 'normal',
        weight: 600,
      },
    ],
  });
}
