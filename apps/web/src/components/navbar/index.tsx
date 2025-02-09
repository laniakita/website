'use client';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as darklogo from '@/app/laniakita-logo-transparent-darkmode.svg';
import * as lightlogo from '@/app/laniakita-logo-transparent-lightmode.svg';
import { useDarkStore } from '@/providers/theme-store-provider';
import { RESUME_LINK } from '@/lib/constants';
import DarkModeSwitch from '@/components/navbar/dark-mode-switch';
import LinkPlus from '@/components/navbar/link-plus';
import {
  IPAD_TOC_ID,
  NAV_MAIN_ID,
  NAV_MAIN_MOBILE_CONTAINER_ID,
  NAV_MAIN_MOBILE_MENU_ID,
  NAV_MAIN_MOBILE_MENU_IO_ID,
} from '@/components/nav-constants';
import { useNavScrollViewStore } from '@/providers/nav-scroll-view-store-provider';
import SimpleSocials from './simple-socials';
import { simpleSocialItems } from './data';
import { useToCViewStore } from '@/providers/toc-view-store-provider';
import { usePathname } from 'next/navigation';

const pagesArr = ['Blog', 'About', 'Work', 'Projects', 'Atom/RSS', 'Résumé', 'Contact'];

export default function Navbar() {
  const { dark } = useDarkStore((state) => state);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const dropNavRef = useRef<HTMLDivElement>(null!);
  const navBarRef = useRef<HTMLDivElement>(null!);
  const { inView, setNavInView, setNavNotInView } = useNavScrollViewStore((state) => state);
  const { tocInView, setToCInView, setToCNotInView } = useToCViewStore((state) => state);
  const [isPost, setIsPost] = useState(false);
  const [tocLastSeen, setToCLastSeen] = useState(0);

  const handleNavOffClick = useCallback((e: MouseEvent) => {
    //console.log(e.target.nodeName);
    e.stopPropagation();
    if ((e.target as Node).nodeName === 'BUTTON' || (e.target as Node).nodeName === 'A') {
      // do nothing
      //console.log('hello!')
    } else if (dropNavRef?.current?.contains(e.target as Node)) {
      //console.log('hello!')
    } else if (
      navBarRef?.current?.contains(e.target as Node) &&
      (e.target as HTMLButtonElement).id !== NAV_MAIN_MOBILE_MENU_IO_ID &&
      (e.target as HTMLDivElement).id !== 'mobile-nav-offclick-bg'
    ) {
      // do nothing
    } else {
      setHamburgerOpen(false);
    }
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    if (tocInView) {
      setToCLastSeen(performance.now());
    } else {
      setToCLastSeen(performance.now());
    }

    const handleChange = () => {
      //console.log('setting toc via pref:', localStorage.getItem('toc-state-pref'));
      if (localStorage.getItem('toc-state-pref') === 'open') {
        setToCInView();
      } else if (localStorage.getItem('toc-state-pref') === 'closed') {
        setToCNotInView();
      }
    };
    handleChange();
  }, [tocInView, setToCLastSeen, setToCInView, setToCNotInView]);

  useEffect(() => {
    if (pathname.split('/').find((segment) => segment === 'blog') && pathname.split('/').length > 2) {
      setIsPost(true);
    } else {
      setIsPost(false);
      setToCNotInView();
    }
  }, [setIsPost, pathname, setToCNotInView]);

  useEffect(() => {
    let lastScrollTop = 0;
    const scrollBuffer = 10;
    const handleScroll = () => {
      if (hamburgerOpen) return;
      if (!isPost) {
        setNavInView();
        return;
      }
      if (performance.now() - tocLastSeen < 800) return;

      const currScrollTop = window.scrollY;

      if (currScrollTop - scrollBuffer > lastScrollTop) {
        // scrolling down => slide navbar up
        setNavNotInView();
      } else if (currScrollTop + scrollBuffer < lastScrollTop) {
        // scrolling up => slide navbar down
        setNavInView();
      }
      lastScrollTop = currScrollTop <= 0 ? 0 : currScrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hamburgerOpen, isPost, tocInView, tocLastSeen, setNavInView, setNavNotInView]);

  useEffect(() => {
    document.addEventListener('click', handleNavOffClick);
    return () => {
      document.removeEventListener('click', handleNavOffClick);
    };
  }, [handleNavOffClick]);

  const logo = dark ? darklogo : lightlogo;

  return (
    <div className='@container/nav sticky top-0 z-50'>
      <nav
        id={NAV_MAIN_ID}
        ref={navBarRef}
        className={`sticky top-0 z-50 flex h-16 flex-row items-center justify-between px-6 ${inView ? 'translate-y-0' : '-translate-y-full'} bg-ctp-base/80 duration-300 motion-safe:transition-transform dark:bg-ctp-midnight/50`}
      >
        <div id='nav-mask-bg' className='nav-glassy-bg' />
        <div id='nav-mask-edge' className='nav-glassy-edge' />

        <ul className='z-[51] flex flex-row items-center gap-[1.5ch]'>
          {isPost && (
            <li
              className={`hidden items-center justify-center md:flex ${tocInView ? 'w-0 opacity-0' : 'w-full opacity-100'} motion-safe:transition-[opacity_0.38s_ease,_width_0.38s_ease]`}
            >
              <button
                aria-expanded='true'
                aria-controls={IPAD_TOC_ID}
                onClick={() => {
                  setToCInView();
                  localStorage.setItem('toc-state-pref', 'open');
                }}
                className='icon-[ph--sidebar-simple-fill] text-3xl'
              />
            </li>
          )}

          <li className='max-w-max'>
            <Link href='/' className='relative flex size-full w-16 items-center justify-center nav-logo'>
              <Image
                src={logo}
                alt="Logo of Lani's Initial. Click to go home."
                className='absolute mb-px h-11 object-contain'
              />
            </Link>
          </li>

          {pagesArr.map((page) => (
            <li key={crypto.randomUUID()} className={`@max-4xl/nav:hidden`}>
              <NavLink page={page} />
            </li>
          ))}
        </ul>

        <div className='z-[51] flex flex-row items-center justify-center gap-2'>
          <SimpleSocials arr={simpleSocialItems} />
          <span className='px-1 font-thin text-ctp-subtext1/80'>|</span>
          <DarkModeSwitch />
          <span className={`px-1 font-thin text-ctp-subtext1/80 @4xl/nav:hidden`}>
            |
          </span>
          <HamburgerToggle {...{ hamburgerOpen, setHamburgerOpen, tocInView, isPost }} />
        </div>
      </nav>

      <MobileDropdown {...{ hamburgerOpen, setHamburgerOpen, dropNavRef, tocInView, isPost }} />
    </div>
  );
}

function NavLink({ page}: { page: string }) {
  const handleRef = (pageStr: string) => {
    if (pageStr.toLowerCase() === 'home') {
      return '/';
    } else if (pageStr.toLowerCase() === 'atom/rss') {
      return '/atom.xml';
    } else if (pageStr.toLowerCase() === 'résumé') {
      return RESUME_LINK;
    }
    return `/${pageStr.toLowerCase()}`;
  };
  return (
    <LinkPlus
      href={handleRef(page)}
      className={`nav-item @max-4xl/nav:text-xl`}
      target={page.toLowerCase() === 'atom/rss' || page.toLowerCase() === 'résumé' ? '_blank' : undefined}
      rel={page.toLowerCase() === 'atom/rss' || page.toLowerCase() === 'résumé' ? 'noopener noreferrer' : undefined}
      type={
        page.toLowerCase() === 'atom/rss'
          ? 'application/atom+xml'
          : page.toLowerCase() === 'résumé'
            ? 'application/pdf'
            : undefined
      }
    >
      <span className='pointer-events-none whitespace-nowrap md:whitespace-break-spaces'>
        {page === 'Atom/RSS' ? page : page.toLowerCase()}
      </span>
    </LinkPlus>
  );
}

interface HamburgerToggleProps {
  hamburgerOpen: boolean;
  setHamburgerOpen: Dispatch<SetStateAction<boolean>>;
  tocInView: boolean;
  isPost: boolean;
}

function HamburgerToggle({ hamburgerOpen, setHamburgerOpen, tocInView, isPost }: HamburgerToggleProps) {
  return (
    <div className={`z-[51] flex flex-row-reverse items-center @4xl/nav:hidden`}>
      <button
        id={NAV_MAIN_MOBILE_MENU_IO_ID}
        aria-expanded={!hamburgerOpen}
        aria-controls={NAV_MAIN_MOBILE_MENU_ID}
        type='button'
        onClick={() => {
          setHamburgerOpen(!hamburgerOpen);
        }}
        className='rounded-md'
        aria-label={`${hamburgerOpen ? 'close' : 'open'} mobile navigation menu.`}
      >
        <span className='pointer-events-none flex size-fit flex-col items-center justify-center gap-1'>
          <span
            className={`${hamburgerOpen ? 'translate-y-1 rotate-[-40deg]' : ''} h-0.5 w-6 bg-ctp-text motion-safe:transition-transform`}
          />
          <span
            className={`${hamburgerOpen ? 'opacity-0' : ''} h-0.5 w-6 bg-ctp-text duration-300 motion-safe:transition-opacity`}
          />
          <span
            className={`${hamburgerOpen ? '-translate-y-2 rotate-[40deg]' : ''} h-0.5 w-6 bg-ctp-text motion-safe:transition-transform`}
          />
        </span>
      </button>
    </div>
  );
}

interface MobileDropdownProps extends HamburgerToggleProps {
  dropNavRef: RefObject<HTMLDivElement>;
}

function MobileDropdown({ hamburgerOpen, setHamburgerOpen, dropNavRef }: MobileDropdownProps) {
  const pathname = usePathname();
  const [path, setPath] = useState(pathname);
  useEffect(() => {
    if (pathname !== path) {
      setPath(pathname);
      if (pathname !== 'feed.xml') {
        setHamburgerOpen(false);
      }
    }
  }, [path, pathname, setHamburgerOpen]);

  return (
    <nav className={`pointer-events-none absolute top-16 z-50 flex min-h-dvh w-full`}>
      {/* mobile menu container */}
      <div
        id='mobile-nav-offclick-bg'
        className={`${hamburgerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} absolute inset-0 z-40 flex min-h-full flex-col justify-start bg-black/40 duration-300 [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] perspective-[5px] motion-safe:transition-opacity`}
      >
        {/* menu box */}
        <div
          id={NAV_MAIN_MOBILE_CONTAINER_ID}
          ref={dropNavRef}
          className={`${hamburgerOpen ? '[transform:translate3d(0%,0%,0px)]' : '[transform:translate3d(0%,-100%,-0.01rem)] opacity-0'} min-h-fit w-full overflow-y-auto rounded-b-2xl border-b border-ctp-pink bg-ctp-base/90 backdrop-blur-md [transition-timing-function:_cubic-bezier(0.4,0,0.2,1)] motion-safe:[transition:transform_0.5s,_opacity_0.3s,_background-color_0.8s] dark:border-ctp-sky dark:bg-ctp-midnight/90`}
        >
          <menu id={NAV_MAIN_MOBILE_MENU_ID} aria-expanded={hamburgerOpen} className='flex flex-col gap-3 p-10'>
            {pagesArr.map((page) => (
              <li key={crypto.randomUUID()}>
                <NavLink page={page} hamburgerOpen={hamburgerOpen} />
              </li>
            ))}
          </menu>
        </div>
      </div>
    </nav>
  );
}
