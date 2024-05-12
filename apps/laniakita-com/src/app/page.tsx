import Link from 'next/link';
import NoiseShader01 from '@/components/canvas/scenes/shaders/noise/noise';

export default function Home() {
  return (
    <main className='flex h-dvh w-full items-center justify-center'>
      <div className='absolute z-[2] flex h-dvh w-full items-center justify-center bg-ctp-midnight/10 dark:bg-ctp-midnight/40'>
        <div className='flex flex-col items-center justify-center gap-4  md:gap-6'>
          <h1 className='text-4xl font-black uppercase text-ctp-base dark:text-ctp-text md:text-5xl'>Lani Akita</h1>
          <div className='flex w-full flex-col gap-2 md:gap-4'>
            <Link
              href='/about'
              className='rounded-xl border border-ctp-base bg-ctp-base/80 p-2 text-center font-mono text-lg text-ctp-text backdrop-blur-md  hover:border-ctp-mauve hover:bg-ctp-base hover:text-ctp-mauve dark:border-ctp-surface0  dark:bg-ctp-midnight/70 dark:hover:bg-ctp-midnight'
            >
              Learn More
            </Link>

            <Link
              href='/blog'
              className='rounded-xl border border-ctp-base bg-ctp-base/80 p-2 text-center font-mono text-lg text-ctp-text backdrop-blur-md  hover:border-ctp-mauve hover:bg-ctp-base hover:text-ctp-mauve dark:border-ctp-surface0 dark:bg-ctp-midnight/70 dark:hover:bg-ctp-midnight'
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
