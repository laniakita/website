'use client';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer/footer';
import { ViewCanvasLayout } from './dom/three-layout';
import dynamic from 'next/dynamic';
import { ReactLenisScroller } from '@/components/virtual-scroller/react-lenis';

const Section = dynamic(() => import('./page-sections/section'), { ssr: false });
const Hero = dynamic(() => import('./page-sections/hero'), { ssr: true });

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

export function ThreePage(props: ThreePageProps) {
  return (
    <ViewCanvasLayout>
      <ReactLenisScroller>
        <Navbar />
        <Hero />
        <div className='px-6 py-20'>
          <div className='relative flex w-full flex-col items-center gap-y-40 px-6'>
            <Section title="Aloha, I'm Lani" markdown={props.data.markdown.summary.code}>
              <figure className='m-0'>
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
            </Section>
            <Section title='Passion Projects' page={1} markdown={props.data.markdown.projects.code} />
            <Section title='Client Works' page={2} markdown={props.data.markdown.works.code} />
            <Section title='Latest from the Blog' page={3} markdown={props.data.markdown.blog.code} />
          </div>
        </div>
        <Footer />
      </ReactLenisScroller>
    </ViewCanvasLayout>
  );
}
