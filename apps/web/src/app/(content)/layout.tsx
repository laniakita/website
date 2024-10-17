import type { ReactNode } from 'react';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import DyanmicHighlighter from '@/components/highlighter/main';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
