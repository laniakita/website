import Link from 'next/link';
import NoiseShader01 from '@/components/canvas/scenes/shaders/noise/noise';

export default function Home() {
  return (
    <main className='flex h-screen min-h-[40rem] w-full items-center justify-center'>
      <div className='simple-color-trans absolute z-[2] flex size-full h-screen min-h-[40rem] items-center justify-center bg-ctp-midnight/10 dark:bg-ctp-midnight/40'>
        <div className='simple-color-trans flex flex-col items-center justify-center gap-4  rounded-md bg-ctp-base/80 p-4'>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-black uppercase text-ctp-text'>Lani Akita</h1>
            <h2 className='text-[1.45rem] font-semibold uppercase'>Full Stack Developer</h2>
          </div>
          <div className='flex w-full flex-col gap-3'>
            <Link
              href='/about'
              className='color-trans-quick rounded border border-ctp-base bg-ctp-base/80 p-2 text-center font-mono text-lg text-ctp-text  backdrop-blur-md hover:border-ctp-pink hover:bg-ctp-pink hover:text-ctp-base  dark:border-ctp-surface0 dark:bg-ctp-midnight/70   dark:hover:border-ctp-flamingo dark:hover:bg-ctp-pink'
            >
              About Me
            </Link>

            <Link
              href='/projects'
              className='color-trans-quick rounded border border-ctp-base bg-ctp-base/80 p-2 text-center font-mono text-lg text-ctp-text  backdrop-blur-md hover:border-ctp-pink hover:bg-ctp-pink hover:text-ctp-base  dark:border-ctp-surface0 dark:bg-ctp-midnight/70   dark:hover:border-ctp-flamingo dark:hover:bg-ctp-pink'
            >
              My Projects
            </Link>

            <Link
              href='/blog'
              className='color-trans-quick rounded border border-ctp-base bg-ctp-base/80 p-2 text-center font-mono text-lg text-ctp-text  backdrop-blur-md hover:border-ctp-pink hover:bg-ctp-pink hover:text-ctp-base dark:border-ctp-surface0 dark:bg-ctp-midnight/70  dark:hover:border-ctp-flamingo dark:hover:bg-ctp-pink'
            >
              Read the Blog
            </Link>

            <Link
              href='/contact'
              className='color-trans-quick rounded border border-ctp-mauve bg-ctp-mauve/10 p-2 text-center font-mono text-lg text-ctp-mauve   backdrop-blur-md  hover:border-ctp-surface0 hover:bg-ctp-pink hover:text-ctp-base dark:bg-ctp-mauve/30 dark:hover:border-ctp-flamingo dark:hover:bg-ctp-pink'
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
