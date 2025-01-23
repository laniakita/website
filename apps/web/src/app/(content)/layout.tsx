import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';

export default function ContentLayout({ children }: { children: ReactNode }) {

  return (
    <>
      {children}
      <Footer />
    </>
  );
}
