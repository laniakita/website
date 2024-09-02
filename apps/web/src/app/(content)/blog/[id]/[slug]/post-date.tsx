'use client'
import dynamic from 'next/dynamic';

const LocalDate = dynamic(() => import('../../local-date').then((mod) => mod.default), {
  ssr: false,
  loading: () => <span>Month, Xst, 2KZZ</span>,
});

export default function PostDate({date}:{date: string}) {
  return <LocalDate date={date} />
}


