import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import ToCMenuCore, { ToCMenuMobileCore } from '@/components/table-of-contents/core';
import { allPosts } from '@/lib/fumadocs';
import { notFound } from 'next/navigation';

export default async function PostPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const post = allPosts.find((postX) => slug.some((sl) => postX.url.split('/').pop() === sl));

  if (!post) return notFound();

  const flatHeadingsAlt: { id: string; content: string; }[] = []

  const ReactDomServer = await import('react-dom/server');

  const toc = post.toc.map((item) => {
    const { depth, url, title } = item

    const titleHtml = ReactDomServer.renderToStaticMarkup(title as ReactNode);

    flatHeadingsAlt.push({ id: url.substring(1), content: titleHtml })

    return {
      depth,
      url,
      title: titleHtml
    }

  });


  //console.log(toc)

  return (
    <div className='flex size-full flex-col md:relative md:flex-row'>
      <ToCMenuCore flatHeadings={flatHeadingsAlt} nestedHeadings={toc} />

      <div className='size-full min-w-0'>
        <Navbar />
        <ToCMenuMobileCore
          flatHeadings={flatHeadingsAlt}
          nestedHeadings={toc}
        />
        <div className='flex max-w-7xl flex-col md:m-auto md:min-w-0'>
          {children}
          <Footer
            override
            outsidePadding='px-0 md:px-6 pb-10 lg:pb-common'
            insidePadding='p-6 md:p-0 lg:p-10'
            iconContainerPadding='px-4 md:px-0'
            linksContainerPadding='p-4 md:px-0'
          />
        </div>
      </div>
    </div>
  );
}
