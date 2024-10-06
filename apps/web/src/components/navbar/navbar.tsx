'use client';
import { Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as darklogo from '@/app/laniakita-logo-transparent-darkmode.svg';
import * as lightlogo from '@/app/laniakita-logo-transparent-lightmode.svg';
import { useDarkStore } from '@/providers/theme-store-provider';
import { type SocialNavIcon } from '../social-icon';
import { socialItems3 } from '../sidebar/main';
import DarkModeSwitch from './dark-mode-switch';
import LinkPlus from './link-plus';
import { RESUME_LINK } from '@/lib/constants';

interface Clicked {
  stateVal: string;
}

export default function NavBar() {
  const { dark } = useDarkStore((state) => state);
  const pagesArr = ['Blog', 'About', 'Projects', 'Atom/RSS', 'Résumé', 'Contact'];
  const pagesArrMobile = ['Blog', 'About', 'Projects', 'Résumé', 'Atom/RSS', 'Contact'];
  const [clicked, setClicked] = useState<Clicked>({
    stateVal: 'closed',
  });
  const dropNavRef = useRef<HTMLDivElement>(null!);

  const handleNavOffClick = useCallback(
    (e: MouseEvent) => {
      if ((e.target as Node).nodeName === 'BUTTON') {
        // do nothing
      } else if (dropNavRef.current.contains(e.target as Node)) {
        // do nothing
      } else {
        setClicked({ ...clicked, stateVal: 'closed' });
      }
    },
    [clicked],
  );

  useEffect(() => {
    document.addEventListener('click', handleNavOffClick);
    return () => {
      document.removeEventListener('click', handleNavOffClick);
    };
  }, [handleNavOffClick]);

  function handleRef(pageStr: string) {
    if (pageStr.toLowerCase() === 'home') {
      return '/';
    } else if (pageStr.toLowerCase() === 'atom/rss') {
      return '/atom.xml';
    } else if (pageStr.toLowerCase() === 'résumé') {
      return RESUME_LINK;
    };
    return `/${pageStr.toLowerCase()}`;
  }

  const logo = dark ? darklogo : lightlogo;

  return (
    <nav className=''>
      <Suspense>
        {/* mobile menu container */}
        <div
          className={`${clicked.stateVal === 'open' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed left-0 top-16 z-40 flex h-[calc(100dvh-3.9rem)] max-h-[calc(100dvh-3.9rem)] w-full flex-col justify-start bg-black/40 [perspective:_5px] [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:_opacity_0.3s,] lg:bottom-0`}
        >
          {/* menu box */}
          <div
            ref={dropNavRef}
            className={`${clicked.stateVal === 'open' ? 'opacity-100 [transform:translate3d(0%,0%,0px)]' : 'opacity-0 [transform:translate3d(0%,-100%,-0.01rem)]'} max-h-[calc(100dvh-3.9rem)] w-full overflow-y-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.5s,_opacity_0.3s,_background-color_0.8s] lg:hidden dark:border-ctp-sky dark:bg-ctp-midnight/90`}
          >
            <div className='flex size-full flex-col gap-3 p-10'>
              {pagesArrMobile.map((page) => (
                <LinkPlus
                  href={handleRef(page)}
                  key={page}
                  className='nav-item text-xl'
                  onClick={() => {
                    page !== 'Atom/RSS' && setClicked({ ...clicked, stateVal: 'closed' });
                  }}
                  target={page === 'Atom/RSS' ? '_blank' : undefined}
                  type={page === 'Atom/RSS' ? 'application/atom+xml' : undefined}
                >
                  <span className='whitespace-nowrap'>{page === 'Atom/RSS' ? page : page.toLowerCase()}</span>
                </LinkPlus>
              ))}
            </div>
          </div>
        </div>
      </Suspense>

      <div
        className={`motion-safe:simple-color-trans fixed inset-x-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-ctp-base px-6 text-xl shadow-lg backdrop-blur-md [transition:_opacity_0.8s] dark:border-ctp-surface0 ${clicked.stateVal === 'open' ? 'bg-ctp-base/90 dark:bg-ctp-midnight/80' : 'bg-ctp-base/80 dark:bg-ctp-midnight/70'}`}
      >
        <div className='flex flex-row-reverse items-center justify-center gap-1 lg:flex-row'>
          <LinkPlus href='/' className='nav-logo relative flex size-full w-16 items-center justify-center'>
            <Image
              src={logo}
              alt="Logo of Lani's Initial. Click to go home."
              className='absolute mb-px h-11 object-contain'
            />
          </LinkPlus>
          <div className='hidden lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-4'>
            {pagesArr.map((page) => (
              <LinkPlus
                key={page}
                href={handleRef(page)}
                className='nav-item'
                target={page === 'Atom/RSS' ? '_blank' : undefined}
                type={page === 'Atom/RSS' ? 'application/atom+xml' : undefined}
              >
                <span className='whitespace-nowrap'>{page === 'Atom/RSS' ? page : page.toLowerCase()}</span>
              </LinkPlus>
            ))}
          </div>

          <div className='visible flex flex-row-reverse items-center lg:hidden'>
            <button
              type='button'
              onClick={() => {
                clicked.stateVal === 'closed' && setClicked({ ...clicked, stateVal: 'open' });
              }}
              className='visible rounded-md lg:hidden'
              aria-label={`${clicked.stateVal === 'open' ? 'close' : 'open'} mobile navigation menu.`}
            >
              <span className='flex size-fit flex-col items-center justify-center gap-1'>
                <span
                  className={`${clicked.stateVal === 'open' ? 'translate-y-1 rotate-[-40deg]' : ''} h-0.5 w-6 bg-ctp-text motion-safe:[transition:transform_0.3s]`}
                />
                <span
                  className={`${clicked.stateVal === 'open' ? 'opacity-0' : ''} h-0.5 w-6 bg-ctp-text motion-safe:[transition:opacity_0.3s]`}
                />
                <span
                  className={`${clicked.stateVal === 'open' ? '-translate-y-2 rotate-[40deg]' : ''} h-0.5 w-6 bg-ctp-text motion-safe:[transition:transform_0.3s]`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className='flex flex-row items-center justify-center gap-2'>
          <DarkModeSwitch />
          <SimpleSocials arr={socialItems3} />
        </div>
      </div>
    </nav>
  );
}

function SimpleSocials({ arr }: { arr: SocialNavIcon[] }) {
  const uKey = useId();
  return (
    <>
      {arr.map((icon, idx: number) => (
        <p key={`nav-social-icon-${uKey}-${Math.floor(Math.random() * 1000 + idx)}`} className=''>
          <Link
            target='_blank'
            aria-label={`Follow Lani on ${icon.linkName}`}
            href={icon.url}
            className='flex items-center justify-center text-3xl text-ctp-subtext1/80 dark:hover:text-ctp-pink'
          >
            <span className={`${icon.iconName} text-3xl`} />
          </Link>
        </p>
      ))}
    </>
  );
}
