import Footer from '@/components/footer/footer';
import ToCMenu from '@/components/toc-nav';
import type { ReactNode } from 'react';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='flex size-full flex-col md:flex-row'>
      <ToCMenu />
      <div className='flex max-w-7xl flex-col md:m-auto md:min-w-[10rem]'>
        {children}
        <Footer override={false} />
      </div>
    </div>
  );
}
