'use client';

import { SocialIconNavProps } from '@/components/social-icon';
import { ReactNode, useRef } from 'react';
import { useIntersectionObserver } from './utils';
import { socialItemsV } from '@/lib/socials-data';
import TextSplitterUltra from '@/components/text-splitter-v2';
import dynamic from 'next/dynamic';
import slugify from '@/utils/slugify';
import Lenis from 'lenis';

const NoiseShader01View = dynamic(() => import('../projects/(three)/shaders/noise/01/noise'), { ssr: false });

export function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'>
      {boxItems.map((item) => (
        // eslint-disable-next-line react/jsx-no-target-blank -- noreferrer is used...
        <a
          key={crypto.randomUUID()}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : 'noreferrer'}
          href={item.url}
          className='items-center justify-center text-ctp-text color-trans-quick hover:text-ctp-pink md:text-ctp-subtext0'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize} pointer-events-none`} />
        </a>
      ))}
    </div>
  );
}

function HeroDivider() {
  return (
    <div className='mx-auto h-px w-full bg-ctp-text @md:mx-0 @md:h-auto @md:min-h-full @md:w-0.5 @md:overflow-visible' />
  );
}

export function Hero() {
  return (
    <div className='@container relative -mt-16 flex h-dvh w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0 z-[-1]'>
        <NoiseShader01View />
      </div>
      <div className='relative inset-x-0 z-20 flex w-full border-t border-ctp-base bg-ctp-base/80 px-6 backdrop-blur-xl color-trans-quick dark:border-ctp-text dark:bg-ctp-base/50'>
        <div className='m-auto flex w-fit flex-col gap-y-2 py-10 @md:w-full @md:max-w-5xl @md:flex-row @md:gap-x-10 @md:gap-y-0'>
          <div className='mx-auto @md:mx-0 @md:min-w-fit'>
            <h1 className='overflow-hidden text-4xl font-black text-ctp-text uppercase opacity-0 motion-safe:animate-fade-in-up-slow @md:text-5xl'>
              Lani Akita
            </h1>
            <h2
              className='text-lg font-medium uppercase opacity-0 motion-safe:animate-fade-in-down-slow @md:text-2xl'
              style={{ animationDelay: '0.8s' }}
            >
              Full Stack Developer
            </h2>
          </div>

          <HeroDivider />

          <div
            className='mx-auto mt-2 flex flex-row opacity-0 motion-safe:animate-fade-in-down-slow @md:mx-0 @md:hidden'
            style={{ animationDelay: '1.6s' }}
          >
            <SocialIconNav3 boxItems={socialItemsV} />
          </div>

          <div className='mt-6 w-full rounded-md border border-ctp-sapphire bg-ctp-sapphire/20 px-4 py-2 font-mono text-ctp-sapphire @md:hidden'>
            <p className='mx-auto w-fit'>
              scroll down <span className='-mb-0.5 icon-[ph--caret-double-down-bold] animate-bounce' />
            </p>
          </div>

          <div className='my-auto hidden @md:flex @md:min-w-fit @md:flex-col'>
            <SocialIconNav3 boxItems={socialItemsV.slice(0, 3)} />
            <SocialIconNav3 boxItems={socialItemsV.slice(3, 6)} />
          </div>

          <HeroDivider />

          <a href="#Aloha-I'm-Lani" onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById("Aloha-I'm-Lani");
  
          }} className='mt-6 block w-full rounded-md border border-ctp-sapphire bg-ctp-sapphire/20 px-4 py-2 text-center font-mono font-semibold text-ctp-sapphire hover:border-ctp-sky hover:bg-ctp-sky/40 hover:text-ctp-sky @md:my-auto @md:py-4'>
            scroll to see more <span className='-mb-0.5 icon-[ph--caret-double-down-bold] animate-bounce' />
          </a>
        </div>
      </div>
    </div>
  );
}

type HomeSectionProps = {
  title: string;
  page?: number;
  markdown: string;
  children?: ReactNode;
};

export function HomeSection(props: HomeSectionProps) {
  const divRef = useRef(null!);
  const visible = useIntersectionObserver(divRef);

  return (
    <div ref={divRef} aria-current={visible} className='group flex w-full max-w-5xl flex-col items-center md:flex-row'>
      <div className='w-full space-y-10 md:w-1/2'>
        <h1 id={slugify(props.title)} className={`overflow-hidden text-4xl font-bold`}>
          <TextSplitterUltra
            spanRole='heading'
            level={1}
            textIn={props.title}
            reverse={!visible}
            charClass={`${visible ? 'motion-safe:animate-fade-in-up-ultra motion-safe:opacity-0' : 'motion-safe:animate-fade-out-down-ultra'} inline-block`}
          />
        </h1>
        <div
          className={`${visible ? 'motion-safe:animate-fade-in-slide-right motion-safe:opacity-0' : 'motion-safe:animate-fade-out-slide-left'} prose-protocol-omega -mt-6`}
        >
          <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
        </div>
      </div>
      <div
        className={`${visible ? 'opacity-0 motion-safe:animate-big-fade-in-up' : 'motion-safe:animate-big-fade-down'} w-full md:w-1/2 md:pl-10`}
      >
        {props.children}
      </div>
    </div>
  );
}
