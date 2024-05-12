import NoiseShader01 from '@/components/canvas/scenes/shaders/noise/noise';
import Link from 'next/link';

/*
rounded-2xl border border-ctp-surface0 bg-ctp-midnight/80 p-4 shadow-2xl backdrop-blur-md  md:p-6
 */

export default function Home() {
  return (
    <main className='flex h-dvh w-full items-center justify-center'>
      <div className='absolute z-[2] flex h-dvh w-full items-center justify-center bg-ctp-midnight/10 dark:bg-ctp-midnight/40'>
        <div className='flex flex-col items-center justify-center gap-4  md:gap-6'>
          <h1 className='text-4xl font-black uppercase text-ctp-base dark:text-ctp-text md:text-5xl'>Lani Akita</h1>
          <div className='flex w-full flex-col gap-2 md:gap-4'>
            <Link
              href='/about'
              className='rounded-xl border border-ctp-base dark:border-ctp-surface0 bg-ctp-base/80 dark:bg-ctp-midnight/70 p-2 text-center font-mono text-lg  backdrop-blur-md hover:border-ctp-mauve hover:bg-ctp-base dark:hover:bg-ctp-midnight  text-ctp-text hover:text-ctp-mauve'
            >
              Learn More
            </Link>

            <Link
              href='/blog'
              className='rounded-xl border border-ctp-base dark:border-ctp-surface0 bg-ctp-base/80 dark:bg-ctp-midnight/70 p-2 text-center font-mono text-lg  backdrop-blur-md hover:border-ctp-mauve hover:bg-ctp-base dark:hover:bg-ctp-midnight e text-ctp-text hover:text-ctp-mauve'
            >
              Read the Blog
            </Link>

            <Link
              href='/contact'
              className='rounded-xl border border-ctp-mauve bg-ctp-mauve/30 p-2 text-center font-mono text-lg text-ctp-mauve   backdrop-blur-md hover:border-ctp-surface0 hover:bg-ctp-mauve hover:text-ctp-midnight'
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
