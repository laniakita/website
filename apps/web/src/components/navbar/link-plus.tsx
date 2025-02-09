'use client';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { AnchorHTMLAttributes } from 'react';

export default function LinkPlus({
  children,
  href,
  target,
  type,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) {
  const path = usePathname();
  const isCurrentPage = href === path;
  return (
    <Link aria-current={isCurrentPage ? 'page' : undefined} href={href} target={target} type={type} {...props}>
      {children}
    </Link>
  );
}
