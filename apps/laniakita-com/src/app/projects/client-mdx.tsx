import dynamic from 'next/dynamic';
import { ReactElement, useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import type { WorkMetaProps } from '@/app/projects/page';

const EmbedBotClicker = dynamic(() => import('@/components/canvas/scenes/bot-clicker/neil/embed'), { ssr: false });

function FourOhFour() {
  return (
    <div className='bg-ctp-base'>
      <h3>{`No Project Loaded. Hmm something's wrong here`}</h3>
    </div>
  );
}

enum Projects {
  BotClicker = 'bot-clicker',
}

function FindProj({projSlug}:{projSlug:string}) {
  if (Object.values(Projects).includes(projSlug as Projects)) {
    if (projSlug === 'bot-clicker') {
      return <EmbedBotClicker />
    }
  }
  return (<FourOhFour />);
}

// eslint-disable-next-line -- any is needed here to make mdx-bundler types happy
export default function ClientProjPost({ code, frontmatter }: { code: string; frontmatter: Record<string, any> }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <article className=''>
      <header className='flex size-full flex-col items-center justify-center '>
        <div className='flex w-full items-center justify-center p-10 md:py-20 lg:pb-[6.5rem] lg:pt-36'>
          <div className='flex w-full max-w-xl flex-col gap-10'>
            <h1 className='text-4xl font-black md:text-5xl'>{(frontmatter as WorkMetaProps).title}</h1>
            <p className='prose-protocol-omega'>{(frontmatter as WorkMetaProps).descr}</p>
          </div>
        </div>
        <div className='relative flex h-96 w-full items-center justify-center md:h-[30rem] md:max-w-3xl lg:h-[38rem]  lg:max-w-4xl  xl:h-[50rem] xl:max-w-7xl'>
          <FindProj projSlug={(frontmatter as WorkMetaProps).slug} />
        </div>
      </header>
      <div className='flex min-h-full items-center justify-center px-10 py-6'>
        <div className='prose-protocol-omega w-full'>
          <Component />
        </div>
      </div>
    </article>
  );
}
