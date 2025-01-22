import type { ReactNode } from 'react';
import Navbar from '@/components/navbar/wrapped';
import Footer from '@/components/footer/footer';
import { FootnotesStoreProvider } from '@/providers/footnotes-store-provider';

export default function ContentLayout({ children }: { children: ReactNode }) {

  return (
    <>
      <Navbar />
      <FootnotesStoreProvider>{children}</FootnotesStoreProvider>
      <Footer />
    </>
  );
}
