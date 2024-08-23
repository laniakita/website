'use client';
import SocialIconNav from '@/components/social-icon';
import CircleMovie from './circle-movie';
import { FooterBox, FooterBoxSpecial } from './footer-box';
import data from './common-data.json';
import { SocialIconNav2 } from '../sidebar/social-icon-nav-client';
import { socialItems2 } from '../sidebar/main';

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
    title: 'RSS/Atom',
    url: '/feed.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-5xl',
  },
];

export default function Footer({ extra }: { extra?: string }) {
  //const pathname = usePathname();
  return (
    <footer className='relative w-full'>
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
              <div className='flex flex-col items-center justify-center gap-8'>
                <div className='size-full max-w-xs'>
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
    <div className='grid grid-cols-1 space-x-4 [@media_(min-width:_240px)]:grid-cols-2 [@media_(min-width:_350px)]:grid-cols-3'>
      <FooterBox title='navigation' navItems={data.navigationItems} />
      <FooterBoxSpecial title='socials' navItems={socialItems} />
      <FooterBox title='account' navItems={['login', 'subscribe']} />
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
