'use client';
import { type Url } from 'next/dist/shared/lib/router/router';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

interface LinkyProps extends LinkProps {
  children: ReactNode;
  href: Url;
  className?: string;
}

export default function LinkPlus({ children, href, ...props }: LinkyProps) {
  const path = usePathname();
  const isCurrentPage = href === path;
  return (
    <Link aria-current={isCurrentPage ? 'page' : undefined} href={href} {...props}>
      {children}
    </Link>
  );
}
