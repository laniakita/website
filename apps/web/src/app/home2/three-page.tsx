'use client'

import Lenis from 'lenis';
import Navbar from '@/components/navbar/core';
import Footer from '@/components/footer/footer';
import { ViewCanvasLayout } from './dom/three-layout';
import { addEffect } from '@react-three/fiber';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const HomeSection = dynamic(() => import('./components').then((mod) => mod.HomeSection), { ssr: false });
const Hero = dynamic(() => import('./components').then((mod) => mod.Hero), { ssr: false });

type ThreePageProps = {
  data: {
    markdown: {
      summary: {
        code: string,
      },
      profile: {
        code: string,
      },
      projects: {
        code: string,
      },
      works: {
        code: string,
      },
      blog: {
        code: string,
      }
    }
  }
}

export function ThreePage(props: ThreePageProps) {
  useEffect(() => {
    const lenis = new Lenis({ syncTouch: true })
    addEffect((t) => lenis.raf(t));
  }, [])

  return (
    <>
      <Navbar />
      <ViewCanvasLayout>
        <Hero />
        <div className='px-6 py-20'>
          <div className='relative h-[400vh] flex flex-col w-full items-center px-6'>
            <HomeSection title="Aloha, I'm Lani" markdown={props.data.markdown.summary.code}>
              <figure className='m-0 group-aria-[current=false]:animate-big-fade-down group-aria-[current=true]:animate-big-fade-in-up opacity-0'>
                <div className='prose-protocol-omega -mt-6' dangerouslySetInnerHTML={{__html: props.data.markdown.profile.code}} />
                <figcaption>
                  <strong>Fig. 01</strong>: Myself summarized as a JS object. The <em>snake_case</em> implies compatibility
                  with a database, perhaps suggesting this object might be inserted into some database&apos;s table.
                </figcaption>
              </figure>
            </HomeSection>
            <HomeSection title="Passion Projects" page={1} markdown={props.data.markdown.projects.code} />
            <HomeSection title="Client Works" page={2} markdown={props.data.markdown.works.code} />
            <HomeSection title="Latest from the Blog" page={3} markdown={props.data.markdown.blog.code} />
          </div>
        </div>
      </ViewCanvasLayout>
      <Footer />
    </>
  );
}

