'use client';

import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';
import { type SocialIconNavProps } from '@/components/social-icon';
import { socialItemsV } from '@/lib/socials-data';
import dynamic from 'next/dynamic';

const NoiseShader01View = dynamic(() => import('../../projects/(three)/shaders/noise/01/noise'), { ssr: false });

export default function Hero() {
  return (
    <div className='@container relative -mt-16 flex h-dvh w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0 z-[-1]'>
        <NoiseShader01View />
      </div>
      <div className='relative inset-x-0 z-20 flex w-full border-t border-ctp-base bg-ctp-base/80 px-6 backdrop-blur-md color-trans-quick dark:border-ctp-text dark:bg-ctp-midnight/80'>
        <div className='m-auto flex w-fit flex-col gap-y-2 py-10 @3xl:w-full @3xl:max-w-5xl @3xl:flex-row @3xl:gap-x-10 @3xl:gap-y-0'>
          <div className='mx-auto @3xl:mx-0 @3xl:min-w-fit'>
            <h1 className='overflow-hidden text-4xl font-black text-ctp-text uppercase opacity-0 motion-safe:animate-fade-in-up-slow @3xl:text-5xl'>
              Lani Akita
            </h1>
            <h2
              className='text-lg font-medium uppercase opacity-0 motion-safe:animate-fade-in-down-slow @3xl:text-2xl'
              style={{ animationDelay: '0.3s' }}
            >
              Full Stack Developer
            </h2>
          </div>

          <HeroDivider />

          <div className='mx-auto w-fit overflow-hidden'>
            <div
              className='mx-auto mt-2 flex flex-row opacity-0 motion-safe:animate-fade-in-down-slow @3xl:mx-0 @3xl:hidden'
              style={{ animationDelay: '0.6s' }}
            >
              <SocialIconNav3 boxItems={socialItemsV} />
            </div>
          </div>
          <HeroScrollBtn mobile delay='0.8s' />

          <div className='my-auto hidden @3xl:flex @3xl:min-w-fit @3xl:flex-col'>
            <SocialIconNav3 boxItems={socialItemsV.slice(0, 3)} />
            <SocialIconNav3 boxItems={socialItemsV.slice(3, 6)} />
          </div>

          <HeroDivider hideMobile />

          <HeroScrollBtn />
        </div>
      </div>
    </div>
  );
}

function HeroDivider({ hideMobile }: { hideMobile?: boolean }) {
  return (
    <div
      className={`${hideMobile ? 'hidden @3xl:block' : ''} mx-auto h-px w-full bg-ctp-text @3xl:mx-0 @3xl:h-auto @3xl:min-h-full @3xl:w-0.5 @3xl:overflow-visible`}
    />
  );
}

function HeroScrollBtn({ mobile, delay }: { mobile?: boolean; delay?: string }) {
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className='overflow-hidden'>
      <button
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById("Aloha-I'm-Lani");
          if (el) {
            lenis?.scrollTo(el, { offset: window.innerWidth < 768 ? -100 : -200 });
          }
          router.push(`${pathname}/#Aloha-I'm-Lani`);
        }}
        className={`${mobile ? 'opacity-0 @3xl:hidden' : 'hidden @3xl:block'} mt-6 w-full rounded-md border border-ctp-sapphire bg-ctp-sapphire/20 px-4 py-4 text-center font-mono text-sm font-bold text-ctp-sapphire no-underline hover:border-ctp-sky hover:bg-ctp-sky/40 hover:text-ctp-sky motion-safe:animate-fade-in-down-slow @3xl:my-auto @3xl:py-4 @3xl:text-base`}
        style={{
          animationDelay: delay ?? '0s',
        }}
      >
        scroll to see more <span className='-mb-1.5 icon-[ph--caret-double-down-bold] animate-bounce text-xl' />
      </button>
    </div>
  );
}

function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <menu
      aria-expanded={true}
      className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'
    >
      {boxItems.map((item) => (
        <li key={crypto.randomUUID()}>
          {/* eslint-disable react/jsx-no-target-blank -- rel is defined... */}
          <a
            href={item.url}
            className='items-center justify-center text-ctp-text color-trans-quick hover:text-ctp-pink md:text-ctp-subtext0'
            target='_blank'
            rel={item.title.toLowerCase() === 'mastodon' ? 'me' : 'noreferrer'}
            aria-label={`Follow Lani on ${item.linkName}`}
          >
            <span className={`${item.iconName} ${item.textSize} pointer-events-none`} />
          </a>
        </li>
      ))}
    </menu>
  );
}
