'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDarkStore } from '@/providers/theme-store-provider';
import DarkModeSwitch from './dark-mode-switch';
import LinkPlus from './link-plus';

interface Clicked {
  stateVal: string
}

export default function NavBar() {
  const { dark } = useDarkStore((state) => state);
  const pagesArr = ['Blog', 'About', 'Projects', 'RSS', 'Contact'];
  const [clicked, setClicked] = useState<Clicked>({
    stateVal: 'closed',
  });
  const dropNavRef = useRef<HTMLDivElement>(null!);

  const handleNavOffClick = useCallback(
    (e: MouseEvent) => {
      if (dropNavRef.current.contains(e.target as Node)) {
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

  return (
    <nav>
      <div
        className={`${clicked.stateVal === 'open' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-x-0 bottom-[3.9rem] z-40 flex h-[calc(100vh-3.9rem)] flex-col justify-end bg-black/40 [perspective:_5px] [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:_opacity_0.3s,]`}
      >
        <div
          ref={dropNavRef}
          className={`${clicked.stateVal === 'open' ? 'opacity-100 [transform:translate3d(0%,0%,0px)]' : 'opacity-0 [transform:translate3d(0%,100%,-1px)]'} size-fit max-h-[calc(100vh-3.9rem)] w-full overflow-y-auto rounded-t-2xl border-t border-ctp-mauve bg-ctp-base [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.5s,_opacity_0.3s,_background-color_0.8s] lg:hidden`}
        >
          <div className='flex size-full flex-col gap-4 p-4'>
            {pagesArr.map((page) => (
              <LinkPlus
                key={page}
                href={page.toLowerCase() === 'home' ? '/' : `/${page.toLowerCase()}`}
                className='nav-item'
                onClick={() => {
                  setClicked({ ...clicked, stateVal: 'closed' });
                }}
              >
                {page === 'RSS' ? page : page.toLowerCase()}
              </LinkPlus>
            ))}
            <div className='h-px w-full bg-ctp-surface0' />
            <div className='flex flex-row justify-between'>
              <p>Theme Setting: catppuccin{dark ? ' mocha' : ' frappe'}</p>
              <DarkModeSwitch />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${clicked.stateVal === 'open' ? 'bg-ctp-base' : ' bg-ctp-base/80 dark:bg-ctp-base/70'} motion-safe:simple-color-trans fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-between  border-t border-ctp-surface0 px-4 text-xl shadow-lg backdrop-blur-xl [transition:_opacity_0.8s] lg:top-0 lg:h-12 lg:border-b lg:border-t-0`}
      >
        <LinkPlus href='/' className='nav-logo'>
          Lani Akita
        </LinkPlus>

        <div className='visible flex flex-row-reverse items-center gap-2 lg:hidden'>
          <button
            type='button'
            onClick={() => {
              clicked.stateVal === 'closed' && setClicked({ ...clicked, stateVal: 'open' });
            }}
            className='visible rounded-md lg:hidden'
          >
            <span className='flex h-10 w-12 flex-col items-center justify-center gap-1.5'>
              <span
                className={`${clicked.stateVal === 'open' ? 'translate-y-2 rotate-[-40deg] ' : ''} h-0.5 w-8  bg-ctp-text motion-safe:[transition:transform_0.3s]`}
              />
              <span
                className={`${clicked.stateVal === 'open' ? 'opacity-0' : ''} h-0.5 w-8 bg-ctp-text motion-safe:[transition:opacity_0.3s]`}
              />
              <span
                className={`${clicked.stateVal === 'open' ? '-translate-y-2 rotate-[40deg]' : ''} h-0.5 w-8 bg-ctp-text motion-safe:[transition:transform_0.3s]`}
              />
            </span>
          </button>
        </div>

        <div className={`hidden lg:flex  lg:flex-row  lg:items-center lg:justify-center lg:gap-4 `}>
          {pagesArr.map((page) => (
            <LinkPlus
              key={page}
              href={page.toLowerCase() === 'home' ? '/' : `/${page.toLowerCase()}`}
              className='nav-item'
            >
              {page === 'RSS' ? page : page.toLowerCase()}
            </LinkPlus>
          ))}
          <DarkModeSwitch />
        </div>
      </div>
    </nav>
  );
}
/*
function TalkToMe() {
  return (
    <button
      type='button'
      className='rounded-xl border-2 border-ctp-sky bg-ctp-sky/40 px-2.5 py-0.5 font-semibold lowercase text-ctp-text hover:bg-ctp-sky hover:text-ctp-base dark:bg-ctp-sky/0 dark:hover:bg-ctp-sky'
    >
      <p>lets talk</p>
    </button>
  );
} */
