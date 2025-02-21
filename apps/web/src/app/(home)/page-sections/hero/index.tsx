'use client';
import { socialItemsV } from '@/lib/socials-data';
import dynamic from 'next/dynamic';
import HeroDivider from './divider';
import HeroSocials from './socials';

const NoiseShader01 = dynamic(
  () => import('../../../projects/(three)/shaders/noise/01/noise').then((mod) => mod.default),
  { ssr: false },
);

const HeroScrollBtn = dynamic(() => import('./scroll-btn'), { ssr: true });

export default function Hero() {
  return (
    <div className='@container relative -mt-16 flex h-dvh w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0'>
        <NoiseShader01 />
      </div>
      <div className='relative inset-x-0 z-20 flex w-full border-t border-b border-ctp-base bg-ctp-base/80 px-6 backdrop-blur-md color-trans-quick dark:border-ctp-text dark:bg-ctp-midnight/80'>
        <div className='m-auto flex w-fit flex-col gap-y-4 py-10 @3xl:w-full @3xl:max-w-5xl @3xl:flex-row @3xl:gap-x-10 @3xl:gap-y-0'>
          <div className='mx-auto @3xl:mx-0 @3xl:min-w-fit'>
            <h1 className='overflow-hidden text-4xl font-black text-ctp-text uppercase opacity-0 motion-safe:animate-fade-in-up-slow @3xl:text-5xl'>
              Lani Akita
            </h1>
            <h2
              className='text-lg font-medium uppercase opacity-0 motion-safe:animate-fade-in-down-slow @3xl:text-2xl'
              style={{ animationDelay: '0.3s' }}
            >
              Full Stack Developer
            </h2>
          </div>

          <HeroDivider />

          <div className='mx-auto mt-2 overflow-hidden @3xl:hidden'>
            <menu
              className='flex flex-row items-center gap-x-2 opacity-0 motion-safe:animate-fade-in-down-slow @3xl:mx-0 @3xl:hidden'
              style={{ animationDelay: '0.6s' }}
            >
              <HeroSocials boxItems={socialItemsV} />
            </menu>
          </div>

          <HeroScrollBtn mobile delay='0.8s' />

          <div className='my-auto hidden min-w-fit @3xl:flex @3xl:flex-col'>
            <menu className='flex w-fit flex-row items-center gap-x-2'>
              <HeroSocials boxItems={socialItemsV.slice(0, 3)} />
            </menu>
            <menu className='flex w-fit flex-row items-center gap-x-2'>
              <HeroSocials boxItems={socialItemsV.slice(3, 6)} />
            </menu>
          </div>

          <HeroDivider hideMobile />

          <HeroScrollBtn />
        </div>
      </div>
    </div>
  );
}
