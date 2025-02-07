import type { ReactNode } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer/footer';

export default function ProjectsContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
