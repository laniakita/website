import { type ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import dynamic from 'next/dynamic'

const ToCMenu = dynamic(() => import('@/components/toc-nav'), {
  loading: () => <nav className='sticky top-16 min-h-12 border-b-2 border-ctp-overlay0' />,
})

export default function PostPageLayout({ children }: Readonly<{ children: ReactNode }>) {
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
