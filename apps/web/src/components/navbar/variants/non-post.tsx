'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../../core';

// for every other route
export default function NavbarV2NonPost() {
  const pathname = usePathname();

  // return nothing on post routes
  if (pathname.split('/').find((segment) => segment === 'blog') && pathname.split('/').length > 2) {
    return;
  }

  return <Navbar />;
}
