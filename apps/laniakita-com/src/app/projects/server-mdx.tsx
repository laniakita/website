import type { ReactNode } from 'react';
import ShareButton from '@/components/share-btn';
import type { WorkMetaProps } from './page';
import DateOnClient from './date-on-client';

export default function ServerOnlyProjPost({
  frontmatter,
  children,
}: {
  frontmatter: WorkMetaProps;
  children: ReactNode;
}) {
  return (
    <article className=''>
      <header className='flex size-full flex-col items-center justify-center'>
        <div className='flex w-full items-center justify-center px-10 pt-10 md:pt-20 lg:pb-[6.5rem] lg:pt-36'>
          <div className='flex w-full max-w-xl flex-col gap-10'>
            <h1 className='text-4xl font-black md:text-5xl'>{frontmatter.title}</h1>
            <p className='prose-protocol-omega'>{frontmatter.descr}</p>
            <DateOnClient date={frontmatter.date} />
          </div>
          <ShareButton />
        </div>
      </header>
      <div className='flex min-h-full items-center justify-center px-10 py-6'>
        <div className='prose-protocol-omega w-full'>{children}</div>
      </div>
    </article>
  );
}
