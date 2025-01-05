import type { ReactNode } from 'react';
import { DarkStoreProvider } from '@/providers/theme-store-provider';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import { FootnotesStoreProvider } from '@/providers/footnotes-store-provider';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <section>
      <DarkStoreProvider>
        <NavBar />
      </DarkStoreProvider>
      <FootnotesStoreProvider>{children}</FootnotesStoreProvider>
      <DarkStoreProvider>
        <Footer />
      </DarkStoreProvider>
    </section>
  );
}
