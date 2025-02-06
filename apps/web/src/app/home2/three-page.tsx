'use client'

import Lenis from 'lenis';
import Navbar from '@/components/navbar/core';
import Footer from '@/components/footer/footer';
import { ViewCanvasLayout } from './dom/three-layout';
import { NoiseShader01View } from '../projects/(three)/shaders/noise/01/noise';
import { addEffect } from '@react-three/fiber';
import { SocialIconNav3 } from './components';
import { socialItemsV } from '@/lib/socials-data';

const lenis = new Lenis({ syncTouch: true })

addEffect((t) => lenis.raf(t));

function Hero() {
  return (
    <div className='relative -mt-16 flex h-[80dvh] w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <NoiseShader01View />
      </div>
      <div className='relative inset-x-0 z-10 flex w-full animate-fade-in border-t border-ctp-base bg-ctp-base/80 px-6 opacity-0 backdrop-blur-xl color-trans-quick dark:border-ctp-text dark:bg-ctp-base/50'>
        <div className='@container/main m-auto flex w-full max-w-5xl flex-row gap-x-10 py-10'>
          <div className=''>
            <h1 className='text-5xl font-black text-ctp-text uppercase'>Lani Akita</h1>
            <h2 className='text-2xl font-medium uppercase'>Full Stack Developer</h2>
          </div>

          <div className='h-auto min-h-full w-0.5 overflow-visible bg-ctp-text' />

          <div className='my-auto hidden md:flex md:flex-col xl:flex-row xl:gap-2'>
            <SocialIconNav3 boxItems={socialItemsV.slice(0, 3)} />
            <SocialIconNav3 boxItems={socialItemsV.slice(3, 6)} />
          </div>
        </div>
      </div>
    </div>
  );
}

type HomeSectionProps = {
  title: string,
  page?: number
}

function HomeSection(props: HomeSectionProps) {
  return (
    <div className='absolute max-w-5xl w-full' style={{ top: props.page ? `${props.page * 100}dvh` : undefined }}>
      <h1 className='text-4xl font-bold'>{props.title}</h1>
    </div>

  );
}

export function ThreePage() {

  return (
    <>
      <Navbar />
      <ViewCanvasLayout>
        <Hero />
        <div className='relative h-[400vh] py-20 flex flex-col w-full items-center'>
          <HomeSection title="Aloha, I'm Lani" />
          <HomeSection title="Passion Projects" page={1} />
          <HomeSection title="Client Works" page={2} />
          <HomeSection title="Latest from the Blog" page={3} />
        </div>
      </ViewCanvasLayout>
      <Footer />
    </>
  );
}

