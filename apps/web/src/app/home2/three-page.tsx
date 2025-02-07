'use client';
import { type LenisRef, ReactLenis } from 'lenis/react'
import Navbar from '@/components/navbar';
import Footer from '@/components/footer/footer';
import { ViewCanvasLayout } from './dom/three-layout';
import dynamic from 'next/dynamic';
import { type ReactNode, useEffect, useRef } from 'react';
import { addEffect } from '@react-three/fiber';

//const Scroll = dynamic(() => import('../../wrappers/scroll'), { ssr: false });
const HomeSection = dynamic(() => import('./components').then((mod) => mod.HomeSection), { ssr: false });
const Hero = dynamic(() => import('./components').then((mod) => mod.Hero), { ssr: true });

type ThreePageProps = {
  data: {
    markdown: {
      summary: {
        code: string;
      };
      profile: {
        code: string;
      };
      projects: {
        code: string;
      };
      works: {
        code: string;
      };
      blog: {
        code: string;
      };
    };
  };
};

function Scroll2({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null!);

  useEffect(() => {
    const subEffect = addEffect((t) => lenisRef.current?.lenis?.raf(t));
    console.log(lenisRef.current)
    return () => {
      subEffect();
    }
  })

  return (
    <>
      {/* @ts-expect-error -- old types issue? */}
      <ReactLenis options={{ autoRaf: false }} ref={lenisRef}>
        {/* @ts-expect-error -- old types issue? */}
        {children}
      </ReactLenis>
    </>
  )

}

export function ThreePage(props: ThreePageProps) {

  return (
    <Scroll2>
      <Navbar />
      <ViewCanvasLayout>
        <Hero />
        <div className='px-6 py-20'>
          <div className='relative flex w-full flex-col items-center gap-y-40 px-6'>
            <HomeSection title="Aloha, I'm Lani" markdown={props.data.markdown.summary.code}>
              <figure className='m-0' data-lenis-prevent>
                <div
                  className='prose-protocol-omega -mt-6'
                  dangerouslySetInnerHTML={{ __html: props.data.markdown.profile.code }}
                />
                <figcaption>
                  <strong>Fig. 01</strong>: Myself summarized as a JS object. The <em>snake_case</em> implies
                  compatibility with a database, perhaps suggesting this object might be inserted into some
                  database&apos;s table.
                </figcaption>
              </figure>
            </HomeSection>
            <HomeSection title='Passion Projects' page={1} markdown={props.data.markdown.projects.code} />
            <HomeSection title='Client Works' page={2} markdown={props.data.markdown.works.code} />
            <HomeSection title='Latest from the Blog' page={3} markdown={props.data.markdown.blog.code} />
          </div>
        </div>
      </ViewCanvasLayout>
      <Footer />
    </Scroll2>
  );
}
