import Link from 'next/link';
import { DarkStoreProvider } from '@/providers/theme-store-provider';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import NoiseShader01 from '@/app/projects/shaders/noise/01/noise';
import { MAIN_SITE_URL } from '@/lib/constants';

export default function NotFound() {
  return (
    <>
      <DarkStoreProvider>
        <NavBar />
      </DarkStoreProvider>

      <main className='simple-color-trans bg-ctp-base dark:bg-ctp-midnight relative flex size-full h-screen min-h-96 items-center justify-center'>
        <div className='absolute inset-0 z-0'>
          <NoiseShader01 />
        </div>

        <div className='simple-color-trans border-ctp-mauve bg-ctp-base/80 z-10 flex w-fit flex-col items-center justify-center gap-4 rounded-md border p-8 backdrop-blur-md md:p-10'>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-black md:text-7xl'>404</h1>
            <h2 className='text-2xl font-semibold md:text-3xl'>Not Found.</h2>
          </div>
          <div className='bg-ctp-text h-px w-full' />
          <Link href={MAIN_SITE_URL} className='home-btn-standard'>
            return home
          </Link>
        </div>
      </main>
      <DarkStoreProvider>
        <Footer />
      </DarkStoreProvider>
    </>
  );
}
