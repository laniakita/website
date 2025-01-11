import type { ReactNode } from 'react';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import { FootnotesStoreProvider } from '@/providers/footnotes-store-provider';

export default function ProjectsContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavBar />
      <FootnotesStoreProvider>{children}</FootnotesStoreProvider>
      <Footer />
    </>
  );
}
