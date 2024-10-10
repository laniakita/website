'use client';
import dynamic from 'next/dynamic';

const LocalDate = dynamic(() =>
  import('../../local-date').then((mod) => ({
    default: mod.default,
    ssr: false,
    loading: () => <span>Month, Xst, 2KZZ</span>,
  })),
);

export default function PostDate({ date, tag }: { date: string; tag?: boolean }) {
  return <LocalDate date={date} tag={tag} />;
}
