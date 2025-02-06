'use client';
import dynamic from 'next/dynamic';
import { Suspense, type DetailedHTMLProps, type HTMLAttributes } from 'react';

const SectionCore = dynamic(() => import('./section'), { ssr: false });

export default function Section(props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <Suspense fallback={<section {...props} />}>
      <SectionCore {...props} />)
    </Suspense>
  );
}
