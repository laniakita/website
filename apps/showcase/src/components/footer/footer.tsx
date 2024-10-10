'use client';
import { usePathname } from 'next/navigation';
import { socialItems2 } from '../social-data';
import { mainNavArr } from '../nav-data';
import { SocialIconNav2 } from './social-icon-nav-client';
import { FooterBox, FooterBoxSpecial } from './footer-box';

const navItems2 = ['Home', ...mainNavArr];

export default function Footer({ extra }: { extra?: string }) {
  const pathname = usePathname();
  return (
    <footer className={`${pathname === '/' ? 'hidden' : 'block'} relative w-full`}>
      <div
        className={`simple-color-trans relative flex w-full flex-col items-center justify-center overflow-hidden bg-ctp-base dark:bg-ctp-midnight ${extra}`}
      >
        {/* contents container that givs the blurry bg + the pattern */}
        <div className='flex size-full flex-col backdrop-blur-2xl'>
          {/* <FooterSubscribe /> */}
          <div className='flex flex-col items-center justify-center gap-4 pb-16 md:pb-36 md:pt-20 lg:pb-40 lg:pt-20'>
            {/* content container */}
            <div className='w-full space-y-8 p-10 md:w-fit md:rounded-md md:border md:border-ctp-surface0 dark:md:border-ctp-base'>
              {/* logo + search + social_buttons + +copyright + links */}
              <div className='flex w-full flex-col items-center justify-center gap-2 md:gap-10'>
                <div className='w-full px-4 md:px-0'>
                  <SocialIconNav2 boxItems={socialItems2} />
                </div>
                <FooterNavLinks />
                <CopyrightTag />
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
    <div className='grid w-full grid-cols-1 gap-4 p-4 narrow-phone:grid-cols-2 md:p-0'>
      <FooterBox title='navigation' navItems={navItems2} />
      <FooterBoxSpecial title='socials' navItems={socialItems2} />
    </div>
  );
}

function CopyrightTag() {
  const getDate = new Date();
  const currentYear = getDate.getFullYear(); //2024 bby
  return (
    <div className='text-xs'>
      <p>© {currentYear} Lani Akita. All Rights Reserved.</p>
    </div>
  );
}
