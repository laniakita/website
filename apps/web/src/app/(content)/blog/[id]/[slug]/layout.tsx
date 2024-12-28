import Footer from '@/components/footer/footer';
import ToCMenu from '@/components/toc-nav';
import type { ReactNode } from 'react';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='flex size-full flex-row'>
      <ToCMenu />
      <div className='m-auto'>
        {children}
        <Footer override={false} />
      </div>
    </div>
  );
}
