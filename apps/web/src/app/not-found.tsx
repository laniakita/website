'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar/core';
import Footer from '@/components/footer/footer';
import NoiseShader01 from './projects/(three)/shaders/noise/01/noise';

export default function NotFound() {
  return (
    <Suspense>
      <Navbar />

      <main className='relative flex size-full h-screen min-h-96 items-center justify-center bg-ctp-base simple-color-trans dark:bg-ctp-midnight'>
        <div className='absolute inset-0 z-0'>
          <NoiseShader01 />
        </div>

        <div className='z-10 flex w-fit flex-col items-center justify-center gap-4 rounded-md border border-ctp-mauve bg-ctp-base/80 p-8 backdrop-blur-md simple-color-trans md:p-10'>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-black md:text-7xl'>404</h1>
            <h2 className='text-2xl font-semibold md:text-3xl'>Not Found.</h2>
          </div>
          <div className='h-px w-full bg-ctp-text' />
          <Link href='/' className='home-btn-standard'>
            return home
          </Link>
        </div>
      </main>
      <Footer />
    </Suspense>
  );
}
