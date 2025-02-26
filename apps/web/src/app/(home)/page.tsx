import { resMdxMinimal } from '@/lib/mdx-utils';
import { pageData } from './data';
import { MiniMDXComponent } from './mini-mdx-component';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer/footer';
import { ReactLenisScroller } from '@/components/virtual-scroller/react-lenis';
import Hero from './page-sections/hero';
import Main from './page-sections/main';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/home`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1600,
        height: 900,
        url: `/opengraph/home?twitter=true`,
      },
    ],
  },
};

export default async function HomeV2() {
  const summary = await resMdxMinimal(pageData.summarySec);
  const profile = await resMdxMinimal(pageData.profileObj);
  const projects = await resMdxMinimal(pageData.projectSec);
  const works = await resMdxMinimal(pageData.workSec);
  const services = await resMdxMinimal(pageData.servicesSec);
  const servicesTable = await resMdxMinimal(pageData.servicesTable);
  const blog = await resMdxMinimal(pageData.blogSec);
  const ReactDomServer = await import('react-dom/server').then((res) => res.default);
  const data = {
    markdown: {
      summary: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={summary.code} />) },
      profile: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={profile.code} />) },
      projects: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={projects.code} />) },
      works: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={works.code} />) },
      services: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={services.code} />) },
      servicesTable: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={servicesTable.code} />) },
      blog: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={blog.code} />) },
    },
  };

  return (
    <ReactLenisScroller>
      <Navbar />
      <Hero />
      <Main data={data} />
      <Footer />
    </ReactLenisScroller>
  );
}
