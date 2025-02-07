import type { ReactNode } from 'react';
import Footer from '@/components/footer/footer';
import NavbarV2NonPost from '@/components/navbar/variants/non-post';

export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarV2NonPost />
      {children}
      <Footer />
    </>
  );
}
