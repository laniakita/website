import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import ToCMenu from '@/components/table-of-contents/core';
import NavbarV2 from '@/components/navbar/variants/v2/core';

export default function PostPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex size-full max-w-[100vw] flex-col md:relative md:flex-row'>
      <ToCMenu />

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
