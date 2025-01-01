'use client';
import { usePathname } from 'next/navigation';
import { SocialIconNav2 } from '../sidebar/social-icon-nav-client';
import { MAIN_PAGES, SOCIALS_FULL } from '../nav-constants';
import { FooterBox, FooterBoxSpecial } from './footer-box';

export default function Footer({
  extra,
  override,
  outsidePadding,
  insidePadding,
  iconContainerPadding,
  linksContainerPadding,
}: {
  extra?: string;
  override?: boolean;
  outsidePadding?: string;
  insidePadding?: string;
  iconContainerPadding?: string;
  linksContainerPadding?: string;
}) {
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
    return override ? false : flag;
  };

  return (
    <footer
      className={`${hiddenPaths.includes(pathname) ? 'hidden' : 'block'} ${isWeirdPath(pathname, override) ? 'hidden' : ''} relative w-full`}
    >
      <div
        className={`relative flex w-full flex-col items-center justify-center overflow-hidden ${extra}`}
      >
        {/* contents container that givs the blurry bg + the pattern */}
        <div className='flex size-full flex-col backdrop-blur-2xl'>
          {/* <FooterSubscribe /> */}
          <div
            className={`flex flex-col items-center justify-center gap-4 ${outsidePadding ? outsidePadding : 'md:pb-common md:px-6'} `}
          >
            {/* content container */}
            <div
              className={`relative w-full space-y-8 ${insidePadding ? insidePadding : 'p-6 md:p-10'} ${override ? 'lg:max-w-3xl lg:rounded-md lg:border lg:border-ctp-surface0 dark:lg:border-ctp-base' : 'md:max-w-3xl md:rounded-md md:border md:border-ctp-surface0 dark:md:border-ctp-base'} `}
            >
              {/* logo + search + social_buttons + +copyright + links */}
              <div
                className={`flex w-full flex-col items-center justify-center gap-2 ${override ? 'lg:flex-row lg:gap-14' : 'md:flex-row md:gap-14'}`}
              >
                <div
                  className={`flex w-full ${iconContainerPadding ? iconContainerPadding : 'px-4'} ${override ? 'lg:hidden' : 'md:hidden'}`}
                >
                  <div
                    className={`mb-4 flex h-px w-full bg-ctp-surface0 ${override ? 'lg:hidden' : 'md:hidden'} dark:bg-ctp-base`}
                  />
                </div>

                <div
                  className={`w-full space-y-4 ${iconContainerPadding ? iconContainerPadding : 'px-4'} ${override ? 'lg:px-0 lg:pl-4' : 'md:px-0 md:pl-4'}`}
                >
                  <SocialIconNav2 boxItems={SOCIALS_FULL} />
                </div>

                <div
                  className={`hidden h-80 w-px bg-ctp-surface0 ${override ? 'lg:flex' : 'md:flex'} dark:bg-ctp-base`}
                />

                <div
                  className={`flex w-full ${iconContainerPadding ? iconContainerPadding : 'px-4'} ${override ? 'lg:hidden' : 'md:hidden'}`}
                >
                  <div
                    className={`mt-4 flex h-px w-full bg-ctp-surface0 ${override ? 'lg:hidden' : 'md:hidden'} dark:bg-ctp-base`}
                  />
                </div>

                <div className='relative flex size-full flex-col'>
                  <FooterNavLinks linksContainerPadding={linksContainerPadding} override />
                  <div
                    className={`absolute hidden bg-ctp-base px-2 ${override ? 'bottom-[-3.25rem] z-50 lg:flex' : 'bottom-[-3.25rem] md:flex'} dark:bg-ctp-midnight`}
                  >
                    <CopyrightTag />
                  </div>
                </div>

                <div className={`${override ? 'lg:hidden' : 'md:hidden'}`}>
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

function FooterNavLinks({ linksContainerPadding, override }: { linksContainerPadding?: string; override?: boolean }) {
  return (
    <div
      className={`grid w-full grid-cols-1 gap-4 ${linksContainerPadding ? linksContainerPadding : 'p-4'} narrow-phone:grid-cols-2 ${override ? 'lg:gap-14 lg:p-0' : 'md:gap-14 md:p-0'}`}
    >
      <FooterBox title='navigation' navItems={Object.keys({ ...MAIN_PAGES, credits: '/credits' })} />
      <FooterBoxSpecial title='socials' navItems={SOCIALS_FULL} />
    </div>
  );
}

export function CopyrightTag() {
  const getDate = new Date();
  const currentYear = getDate.getFullYear(); //2024 bby
  return (
    <div className='text-xs'>
      <p className='text-balance text-center'>© {currentYear} Lani Akita. All Rights Reserved.</p>
    </div>
  );
}
