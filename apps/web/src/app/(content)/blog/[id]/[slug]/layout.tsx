import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import ToCMenu from '@/components/toc-nav';

export default function PostPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex size-full flex-col md:flex-row'>
      <ToCMenu />
      <div className='flex max-w-7xl flex-col md:m-auto md:min-w-40'>
        {children}
        <Footer
          override
          outsidePadding='px-0 md:px-6 pb-10 lg:pb-common lg:px-10'
          insidePadding='p-6 md:p-0 lg:p-10'
          linksContainerPadding='p-4'
        />
      </div>
    </div>
  );
}
