'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import type { WorkMetaProps } from '@/app/projects/page';

const EmbedBotClicker = dynamic(() => import('@/components/canvas/scenes/bot-clicker/neil/embed'), { ssr: false });
const BulbPortMain = dynamic(() => import('@/components/canvas/scenes/mandelbulb-port/mandelbulb-port'), {ssr: false});
const FlowFields0001Main = dynamic(() => import('@/components/canvas/scenes/flow-fields/0001/main'), {ssr: false});

function FourOhFour() {
  return (
    <div className='bg-ctp-base'>
      <h3>{`No Project Loaded. Hmm something's wrong here`}</h3>
    </div>
  );
}

enum Projects {
  BotClicker = 'bot-clicker',
  MandelbulbPort = 'mandelbulb-ported-into-three',
  FlowFields = 'flow-fields-0001'
}

function FindProj({ projSlug }: { projSlug: string }) {
  if (Object.values(Projects).includes(projSlug as Projects)) {
    if (projSlug === 'bot-clicker') {
      return <EmbedBotClicker />;
    } else if (projSlug === 'mandelbulb-ported-into-three') {
      return <BulbPortMain />;
    } else if (projSlug === 'flow-fields-0001') {
      return <FlowFields0001Main />;
    }
  }
  return <FourOhFour />;
}

// eslint-disable-next-line -- any is needed here to make mdx-bundler types happy
export default function ClientProjPost({ code, frontmatter }: { code: string; frontmatter: Record<string, any> }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  const [fullScreen, setFullScreen] = useState(false);

  return (
    <article className=''>
      <header className={`flex size-full ${fullScreen ? 'flex-col-reverse' : 'flex-col'} items-center justify-center`}>
        <div className='flex w-full items-center justify-center p-10 md:py-20 lg:pb-[6.5rem] lg:pt-36'>
          <div className='flex w-full max-w-xl flex-col gap-10'>
            <h1 className='text-4xl font-black md:text-5xl'>{(frontmatter as WorkMetaProps).title}</h1>
            <p className='prose-protocol-omega'>{(frontmatter as WorkMetaProps).descr}</p>
          </div>
        </div>

        <div
          className={`relative size-full ${fullScreen ? ' inset-0 z-[99]' : ' flex items-center justify-center'} bg-ctp-base dark:bg-ctp-midnight`}
        >
          <div
            className={
              fullScreen
                ? 'relative flex h-dvh w-full items-center justify-center'
                : 'relative flex h-96 w-full items-center justify-center md:h-[30rem] md:max-w-3xl lg:h-[38rem]  lg:max-w-4xl xl:h-[50rem] xl:max-w-7xl'
            }
          >
            {!fullScreen && (
              <button
                onClick={() => {
                  setFullScreen(true);
                }}
                type='button'
                className='absolute bottom-0 right-0 z-10 w-fit text-3xl text-ctp-text opacity-50 hover:opacity-100'
              >
                <span className='icon-[ph--arrows-out]' />
              </button>
            )}
            {(fullScreen as unknown) === true && (
              <button
                onClick={() => {
                  setFullScreen(false);
                }}
                type='button'
                className='absolute bottom-0 right-0 z-10 w-fit text-3xl text-ctp-text opacity-50 hover:opacity-100'
              >
                <span className='icon-[ph--arrows-in]' />
              </button>
            )}
            <FindProj projSlug={(frontmatter as WorkMetaProps).slug} />
          </div>
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
