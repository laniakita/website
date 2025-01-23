'use client';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as darklogo from '@/app/laniakita-logo-transparent-darkmode.svg';
import * as lightlogo from '@/app/laniakita-logo-transparent-lightmode.svg';
import { useDarkStore } from '@/providers/theme-store-provider';
import { RESUME_LINK } from '@/lib/constants';
import { socialItems3 } from '../../../sidebar/main';
import DarkModeSwitch from '@/components/navbar/dark-mode-switch';
import LinkPlus from '@/components/navbar/link-plus';
import { NAV_MAIN_MOBILE_CONTAINER_ID, NAV_MAIN_MOBILE_MENU_IO_ID } from '@/components/nav-constants';
import { SCREEN_LG, SCREEN_MD } from '@/lib/screen-constants';
import { useNavScrollViewStore } from '@/providers/nav-scroll-view-store-provider';
import SimpleSocials from './simple-socials';
import { simpleSocialItems } from './data';
import { useToCViewStore } from '@/providers/toc-view-store-provider';

const handleRef = (pageStr: string) => {
  if (pageStr.toLowerCase() === 'home') {
    return '/';
  } else if (pageStr.toLowerCase() === 'atom/rss') {
    return '/atom.xml';
  } else if (pageStr.toLowerCase() === 'résumé') {
    return RESUME_LINK;
  }
  return `/${pageStr.toLowerCase()}`;
}


const pagesArr = ['Blog', 'About', 'Work', 'Projects', 'Atom/RSS', 'Résumé', 'Contact'];

export default function NavbarV2Core() {
  const { dark } = useDarkStore((state) => state);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const dropNavRef = useRef<HTMLDivElement>(null!);
  const navBarRef = useRef<HTMLDivElement>(null!);
  const { inView, setNavInView, setNavNotInView } = useNavScrollViewStore((state) => state);
  const { tocInView, setToCInView, setToCNotInView } = useToCViewStore((state) => state);

  const handleNavOffClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (
        (e.target as Node).nodeName === 'BUTTON' &&
        (e.target as HTMLButtonElement).id !== NAV_MAIN_MOBILE_MENU_IO_ID
      ) {
        // do nothing
      } else if (dropNavRef?.current?.contains(e.target as Node)) {
        // do nothing
      } else if (
        navBarRef?.current?.contains(e.target as Node) &&
        (e.target as HTMLButtonElement).id !== NAV_MAIN_MOBILE_MENU_IO_ID
      ) {
        // do nothing
      } else {
        setHamburgerOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      if (hamburgerOpen) return;
      const currScrollTop = window.scrollY;

      if (window.innerWidth <= SCREEN_MD) {
        if (currScrollTop > lastScrollTop) {
          // scrolling down => slide navbar up
          setNavNotInView();
        } else if (currScrollTop < lastScrollTop) {
          // scrolling up => slide navbar down
          setNavInView();
        }
        lastScrollTop = currScrollTop <= 0 ? 0 : currScrollTop;
      } else if (window.innerWidth >= SCREEN_MD) {
        setNavInView();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hamburgerOpen, setNavInView, setNavNotInView]);

  useEffect(() => {
    document.addEventListener('click', handleNavOffClick);
    return () => {
      document.removeEventListener('click', handleNavOffClick);
    };
  }, [handleNavOffClick]);


  const logo = dark ? darklogo : lightlogo;

  return (
    <nav className="sticky top-0 z-50 flex h-16 flex-row items-center justify-between px-6">
      <div id='nav-mask-bg' className='nav-glassy-bg' />
      <div id='nav-mask-edge' className='nav-glassy-edge' />


      <ul className='z-[51] flex flex-row items-center gap-2'>
        <li className='flex items-center justify-center'>
          <button onClick={setToCInView} className='icon-[ph--sidebar-simple-fill] text-3xl' />
        </li>
        <li>
          <Link href='/' className='nav-logo relative flex size-full w-16 items-center justify-center'>
            <Image
              src={logo}
              alt="Logo of Lani's Initial. Click to go home."
              className='absolute mb-px h-11 object-contain'
            />
          </Link>
        </li>
        {pagesArr.map((page) => (
          <li key={crypto.randomUUID()}>
            <LinkPlus
              href={handleRef(page)}
              className='nav-item'
              target={page === 'Atom/RSS' ? '_blank' : undefined}
              type={page === 'Atom/RSS' ? 'application/atom+xml' : undefined}
            >
              <span className='whitespace-nowrap'>{page === 'Atom/RSS' ? page : page.toLowerCase()}</span>
            </LinkPlus>
          </li>
        ))}
      </ul>

      <div className='z-[51] flex flex-row items-center justify-center gap-2'>
        <SimpleSocials arr={simpleSocialItems} />
        <span className='px-1 font-thin text-ctp-subtext1/80'>|</span>
        <DarkModeSwitch />
      </div>

    </nav>
  )
}

interface HamburgerToggleProps {
  hamburgerOpen: boolean;
  setHamburgerOpen: Dispatch<SetStateAction<boolean>>;
}

function HamburgerToggle({ hamburgerOpen, setHamburgerOpen }: HamburgerToggleProps) {
  return (
    <div className='visible z-[51] flex flex-row-reverse items-center lg:hidden'>
      <button
        id={NAV_MAIN_MOBILE_MENU_IO_ID}
        type='button'
        onClick={() => {
          if (!hamburgerOpen) {
            setHamburgerOpen(true);
          }
        }}
        className='visible rounded-md lg:hidden'
        aria-label={`${hamburgerOpen ? 'close' : 'open'} mobile navigation menu.`}
      >
        <span className='pointer-events-none flex size-fit flex-col items-center justify-center gap-1'>
          <span
            className={`${hamburgerOpen ? 'translate-y-1 rotate-[-40deg]' : ''} h-0.5 w-6 bg-ctp-text motion-safe:[transition:transform_0.3s]`}
          />
          <span
            className={`${hamburgerOpen ? 'opacity-0' : ''} h-0.5 w-6 bg-ctp-text motion-safe:[transition:opacity_0.3s]`}
          />
          <span
            className={`${hamburgerOpen ? '-translate-y-2 rotate-[40deg]' : ''} h-0.5 w-6 bg-ctp-text motion-safe:[transition:transform_0.3s]`}
          />
        </span>
      </button>
    </div>
  )
}

interface MobileDropdownProps extends HamburgerToggleProps {
  dropNavRef: RefObject<HTMLDivElement>
}

function MobileDropdown({ hamburgerOpen, setHamburgerOpen, dropNavRef }: MobileDropdownProps) {
  return (
    <div className='relative'>
      {/* mobile menu container */}
      <div
        className={`${hamburgerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed left-0 top-16 z-40 flex h-[calc(100dvh-3.9rem)] max-h-[calc(100dvh-3.9rem)] w-full flex-col justify-start bg-black/40 [perspective:_5px] [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:_opacity_0.3s,] lg:bottom-0`}
      >
        {/* menu box */}
        <div
          id={NAV_MAIN_MOBILE_CONTAINER_ID}
          ref={dropNavRef}
          className={`${hamburgerOpen ? 'opacity-100 [transform:translate3d(0%,0%,0px)]' : 'opacity-0 [transform:translate3d(0%,-100%,-0.01rem)]'} max-h-[calc(100dvh-3.9rem)] w-full overflow-y-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.5s,_opacity_0.3s,_background-color_0.8s] lg:hidden dark:border-ctp-sky dark:bg-ctp-midnight/90`}
        >
          <div className='flex size-full flex-col gap-3 p-10'>
            {pagesArr.map((page) => (
              <LinkPlus
                href={handleRef(page)}
                key={page}
                className='nav-item text-xl'
                onClick={() => {
                  if (page !== 'Atom/RSS') {
                    setHamburgerOpen(false);
                  }
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
    </div>
  )
}
