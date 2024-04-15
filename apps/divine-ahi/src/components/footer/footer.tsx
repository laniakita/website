import CircleMovie from './circle-movie';
import { FooterBox, FooterBoxSpecial } from './footer-box';
import SocialIconNav from './social-icon';
import data from './common-data.json';

export const socialItems = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    textSize: 'text-5xl',
  },
  {
    title: 'Mastodon',
    url: 'https://joinmastodon.org/',
    iconName: 'icon-[fa6-brands--mastodon]',
    textSize: 'text-5xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com',
    iconName: 'icon-[fa6-brands--patreon]',
    textSize: 'text-4xl',
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    iconName: 'icon-[fa--linkedin]',
    textSize: 'text-4xl',
  },
  {
    title: 'RSS',
    url: '/rss',
    iconName: 'icon-[ph--rss-bold]',
    textSize: 'text-5xl',
  },
];

export default function Footer({ extra }: { extra?: string }) {
  return (
    <footer className='w-full'>
      <div
        className={`simple-color-trans relative flex w-full flex-col items-center justify-center overflow-hidden bg-ctp-base md:pt-10 dark:bg-ctp-crust  ${extra}`}
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
          <div className='flex flex-col items-start  justify-center gap-4   pb-20 pt-4 lg:pb-4 '>
            {/* content container */}
            <div className=' w-full space-y-8 px-4'>
              {/* logo + search + social_buttons + +copyright + links */}
              <div className=' flex flex-col items-center justify-center gap-8'>
                <SocialIconNav boxItems={socialItems} hxw='h-[3.8rem] w-[3.8rem]' />
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
    <div className='columns-1 gap-4 [@media_(min-width:_240px)]:columns-2 [@media_(min-width:_350px)]:columns-3'>
      <FooterBox title='navigation' navItems={data.navigationItems} />
      <FooterBoxSpecial title='socials' navItems={data.socialItems} />
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
