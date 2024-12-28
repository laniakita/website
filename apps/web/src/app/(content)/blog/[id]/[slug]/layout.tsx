import Footer from '@/components/footer/footer';
import ToCMenu from '@/components/toc-nav';
import type { ReactNode } from 'react';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='flex size-full flex-row'>
      <ToCMenu />
      <div className='m-auto flex flex-col max-w-7xl min-w-[10rem]'>
        {children}
        <Footer override={false} />
      </div>
    </div>
  );
}
