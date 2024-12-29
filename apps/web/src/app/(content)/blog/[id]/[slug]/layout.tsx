import Footer from '@/components/footer/footer';
import ToCMenu from '@/components/toc-nav';
import type { ReactNode } from 'react';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='flex size-full flex-col md:flex-row'>
      <ToCMenu />
      <div className='md:m-auto flex md:min-w-[10rem] max-w-7xl flex-col'>
        {children}
        <Footer override={false} />
      </div>
    </div>
  );
}
