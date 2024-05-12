import NoiseShader01 from '@/components/canvas/scenes/shaders/noise/noise';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex h-dvh w-full items-center justify-center'>
      <div className='ctp-mocha absolute z-[2] flex h-dvh w-full items-center justify-center bg-ctp-midnight/30'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-4xl font-black uppercase text-ctp-text md:text-5xl'>
            Lani Akita
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <Link
              href='/about'
              className='rounded-2xl border border-ctp-surface0 bg-ctp-base/10 p-2 text-center font-mono text-lg  backdrop-blur-md  hover:border-ctp-mauve '
            >
              Learn More
            </Link>

            <Link
              href='/blog'
              className='rounded-2xl border border-ctp-surface0 bg-ctp-base/10 p-2 text-center font-mono text-lg  backdrop-blur-md hover:border-ctp-mauve'
            >
              Read the Blog
            </Link>

            <Link
              href='/contact'
              className='rounded-2xl border border-ctp-mauve bg-ctp-mauve/30 p-2 text-center font-mono text-lg text-ctp-mauve backdrop-blur-md  hover:border-ctp-surface0 hover:bg-ctp-mauve hover:text-black'
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
      <NoiseShader01 />
    </main>
  );
}
