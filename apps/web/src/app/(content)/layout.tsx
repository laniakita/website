import type { ReactNode } from 'react';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';

export default function ContentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
