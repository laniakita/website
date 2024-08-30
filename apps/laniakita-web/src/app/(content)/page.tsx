import type { Metadata } from 'next';
import Link from 'next/link';
import NoiseShader01 from '@/app/projects/(three)/shaders/noise/01/noise';

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/home`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1600,
        height: 900,
        url: `/opengraph/home?twitter=true`,
      },
    ],
  },
};

export default function Home() {
  return (
    <main className='relative flex h-screen min-h-[40rem] w-full items-center justify-center'>
      <div className='absolute inset-0'>
        <NoiseShader01 />
      </div>
      <div className='z-10 flex flex-col items-center justify-center gap-4 rounded-md border border-ctp-mauve bg-ctp-base/80 p-4 backdrop-blur-md md:p-10'>
        <h1 className='text-5xl font-black uppercase text-ctp-text'>Lani Akita</h1>
        <h2 className='text-[1.45rem] font-semibold uppercase'>Full Stack Developer</h2>

        <div className='flex w-full flex-col gap-3'>
          <Link
            href='/about'
            className='home-btn-standard'
          >
            About Me
          </Link>

          <Link
            href='/projects'
            className='home-btn-standard'
          >
            My Projects
          </Link>

          <Link
            href='/blog'
            className='home-btn-standard'
          >
            Read the Blog
          </Link>

          <Link
            href='/contact'
            className='home-btn-extra'
          >
            Contact Me
          </Link>
        </div>
      </div>
    </main>
  );
}
