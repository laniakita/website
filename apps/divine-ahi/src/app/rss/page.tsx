import path from 'node:path';
import process from 'node:process';
import Link from 'next/link';
import { blogPostFinder, insertFromRawIndex } from '@/lib/utils/mdxlite';

export default async function Home() {
  const folder = path.resolve(process.cwd(), 'content')
  await insertFromRawIndex(folder)
  //console.log(test)

  return (
    <main className='ctp-mocha'>
      <div className='flex h-screen w-full items-center justify-center bg-ctp-sky text-ctp-text'>
        testing <span className='icon-[ph--alien-fill]' />
        <div className='flex flex-row gap-4'>
          <Link href='/about'>about</Link>
          <Link href='/credits'>credits</Link>
          <Link href='/terms'>terms</Link>
          <Link href='/privacy'>privacy</Link>
        </div>
      </div>
      <article className='prose prose-catppuccin'>
        <p>this is some text</p>
      </article>
    </main>
  );
}
