'use client';
import { usePathname } from 'next/navigation';
import { SocialIconNav2 } from '../sidebar/social-icon-nav-client';
import { MAIN_PAGES, SOCIALS_FULL } from '../nav-constants';
import { FooterBox, FooterBoxSpecial } from './footer-box';

export default function Footer({ extra, override }: { extra?: string; override?: boolean }) {
  const pathname = usePathname();
  const hiddenPaths = ['/'];
  const weirdPaths = ['blog'];

  const isWeirdPath = (path: string, override?: boolean): boolean => {
    const splitPath = path.split('/');
    let flag = false;
    for (const part of weirdPaths) {
      //console.log(part)
      if (splitPath.includes(part)) {
        flag = true;
      }
    }
    //console.log(flag)
    return override ?? flag;
  };

  return (
    <footer
      className={`${hiddenPaths.includes(pathname) ? 'hidden' : 'block'} ${isWeirdPath(pathname, override) ? 'hidden' : ''} relative w-full`}
    >
      <div
        className={`simple-color-trans relative flex w-full flex-col items-center justify-center overflow-hidden bg-ctp-base dark:bg-ctp-midnight ${extra}`}
      >
        {/* contents container that givs the blurry bg + the pattern */}
        <div className='flex size-full flex-col backdrop-blur-2xl'>
          {/* <FooterSubscribe /> */}
          <div className='lg:pb-common flex flex-col items-center justify-center gap-4 lg:px-4'>
            {/* content container */}
            <div className='relative w-full space-y-8 p-10 lg:max-w-3xl lg:rounded-md lg:border lg:border-ctp-surface0 dark:lg:border-ctp-base'>
              {/* logo + search + social_buttons + +copyright + links */}
              <div className='flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:gap-14'>
                <div className='w-full space-y-4 px-4 lg:px-0 lg:pl-4'>
                  <SocialIconNav2 boxItems={SOCIALS_FULL} />
                </div>

                <div className='hidden h-80 w-px bg-ctp-surface0 lg:flex dark:bg-ctp-base' />
                <div className='flex w-full px-4 lg:hidden'>
                  <div className='mt-4 flex h-px w-full bg-ctp-surface0 lg:hidden dark:bg-ctp-base' />
                </div>
                <div className='relative flex size-full flex-col'>
                  <FooterNavLinks />
                  <div className='absolute bottom-[-4.25rem] hidden bg-ctp-base px-2 lg:flex dark:bg-ctp-midnight'>
                    <CopyrightTag />
                  </div>
                </div>

                <div className='lg:hidden'>
                  <CopyrightTag />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterNavLinks() {
  return (
    <div className='grid w-full grid-cols-1 gap-4 p-4 narrow-phone:grid-cols-2 lg:gap-14 lg:p-0'>
      <FooterBox title='navigation' navItems={Object.keys(MAIN_PAGES)} />
      <FooterBoxSpecial title='socials' navItems={SOCIALS_FULL} />
    </div>
  );
}

export function CopyrightTag() {
  const getDate = new Date();
  const currentYear = getDate.getFullYear(); //2024 bby
  return (
    <div className='text-xs'>
      <p>© {currentYear} Lani Akita. All Rights Reserved.</p>
    </div>
  );
}
