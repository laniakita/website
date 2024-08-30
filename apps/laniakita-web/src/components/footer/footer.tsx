'use client';
import { socialItems2 } from '../sidebar/main';
import { SocialIconNav2 } from '../sidebar/social-icon-nav-client';
import CircleMovie from './circle-movie';
import { FooterBox, FooterBoxSpecial } from './footer-box';
import data from './common-data.json';
import { usePathname } from 'next/navigation';

export const socialItems = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-5xl',
  },
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-5xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-4xl',
  },
  {
    title: 'Atom/RSS',
    url: '/atom.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-5xl',
  },
];

export default function Footer({ extra }: { extra?: string }) {
  const pathname = usePathname();
  return (
    <footer className={`${pathname === '/' ? 'hidden' : 'block'} relative w-full`}>
      <div
        className={`simple-color-trans relative flex w-full flex-col items-center justify-center overflow-hidden  bg-ctp-base dark:bg-ctp-midnight ${extra}`}
      >
        <div className='absolute size-full '>
          <div className=' relative size-full'>
            <CircleMovie animationDelayJit='[animation-delay:_1s]' colorClass='bg-ctp-red' />
            <CircleMovie
              animationDelayJit='[animation-delay:_2s]'
              animationClass='animate-growygrowsup'
              colorClass='bg-ctp-blue'
            />
            <CircleMovie
              animationDelayJit='[animation-delay:_0s]'
              animationClass='animate-growyshrinky'
              colorClass='bg-ctp-mauve'
            />
          </div>
        </div>

        {/* contents container that givs the blurry bg + the pattern */}
        <div className='flex  size-full  flex-col  backdrop-blur-2xl'>
          {/* <FooterSubscribe /> */}
          <div className='flex flex-col items-center  justify-center gap-4  pb-16 md:pb-36 md:pt-20 lg:pb-40 lg:pt-20'>
            {/* content container */}
            <div className='w-full space-y-8 p-10 md:w-fit md:rounded-md md:border md:border-ctp-surface0 dark:md:border-ctp-base'>
              {/* logo + search + social_buttons + +copyright + links */}
              <div className='flex w-full flex-col items-center justify-center gap-2 md:gap-10'>
                {/* <div className='size-full max-w-52 narrow-phone:max-w-xs small-phone:max-w-sm phablet:px-0 beeg-phablet:px-2 fold:px-6 md:max-w-md md:px-0'>
                  <SocialIconNav2 boxItems={socialItems2} />
                </div> */}
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
      <FooterBox title='navigation' navItems={data.navigationItems} />
      <FooterBoxSpecial title='socials' navItems={socialItems} />
    </div>
  );
}

/*
function FooterSearchButton() {
  return (
    <div className="search-button">
      <div className="flex flex-row items-center justify-center gap-4">
        <span className="icon-[ph--magnifying-glass-bold] text-2xl" />
        <p className="text-xl">Search</p>
      </div>
    </div>
  );
}*/

function CopyrightTag() {
  const getDate = new Date();
  const currentYear = getDate.getFullYear(); //2024 bby
  return (
    <div className='text-xs'>
      <p>© {currentYear} Lani Akita. All Rights Reserved.</p>
    </div>
  );
}
