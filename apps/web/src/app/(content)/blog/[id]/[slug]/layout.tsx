import { Suspense, type ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import NavbarV2 from '@/components/navbar/variants/v2/core';
import ToCMenuCore from '@/components/table-of-contents/core';
import { allPosts } from 'contentlayer/generated';
import jsxToHtml from './utils';
import {JSDOM} from 'jsdom'

type Params = Promise<{ id: string; slug: string }>;

export default async function PostPageLayout({ children, params }: { children: ReactNode; params: Params }) {
  
  const { id, slug } = await params;
  const post = allPosts.find(
    (postX) =>
      (postX.id.split('-').shift() === id && postX.url.split('/').pop() === slug) ||
      postX.id.split('-').shift() === id ||
      postX.url.split('/').pop() === slug,
  );

  const postHtml = await jsxToHtml(post!.body.code);
  const doc = new JSDOM(`<!DOCTYPE html>${postHtml}</html>`);
  const headings = Array.from(doc.window.document.querySelectorAll("h2, h3, h4, h5, h6")).filter((el) => el.id.length > 0);
  console.dir(headings, {depth: null})

  return (
    <div className='flex size-full max-w-[100vw] flex-col md:relative md:flex-row'>
      <ToCMenuCore />

      <div className='size-full min-w-0'>
        <NavbarV2 />
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
