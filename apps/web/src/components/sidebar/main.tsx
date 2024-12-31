import Link from 'next/link';
import { allCategories, allTags } from 'contentlayer/generated';
import { SOCIALS_FULL } from '../nav-constants';
import { CopyrightTag } from '../footer/footer';
import InfoBox from './info-box';
import { SocialIconNav2 } from './social-icon-nav-client';

export const socialItems3 = [
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-4xl',
    textSizeAlt: 'text-3xl',
  },
  {
    title: 'Bluesky',
    url: 'https://bsky.app/profile/laniakita.com',
    iconName: 'icon-[fa6-brands--bluesky]',
    linkName: 'Bluesky!',
    textSize: 'text-2xl',
    textSizeAlt: 'text-2xl',
  },
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
    textSizeAlt: 'text-3xl',
  },
];

export const socialItems2 = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Bluesky',
    url: 'https://bsky.app/profile/laniakita.com',
    iconName: 'icon-[fa6-brands--bluesky]',
    linkName: 'Bluesky!',
    textSize: 'text-2xl md:text-3xl',
  },
  {
    title: 'Instagram',
    url: 'https://instagram.com/laniakita',
    iconName: 'icon-[fa6-brands--instagram]',
    linkName: 'Instagram!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com/in/laniakita',
    iconName: 'icon-[fa6-brands--linkedin]',
    linkName: 'Linkedin!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-2xl md:text-3xl',
  },
];

const blogInfo = 'A blog about life, Linux, and web development. Written by, [Lani Akita](/about).';

export default function Sidebar() {
  const categories = allCategories.sort((a, b) => a.title.localeCompare(b.title));
  const tags = allTags.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className='flex size-full max-h-[calc(100vh-4rem)] shadow-xl md:sticky md:top-16'>
      <div className='flex w-full flex-col gap-0 overflow-y-auto bg-ctp-surface0/20 md:gap-6 md:border md:p-4 dark:border-ctp-base dark:bg-ctp-base/20'>
        <InfoBox categories={categories} tags={tags} socialItems={socialItems2} blogInfo={blogInfo} />
        <SubscribeBox />
        <div className='relative flex w-full flex-col items-center justify-center md:pb-4'>
          <SocialBox />
          {/*
          <div className='absolute bottom-2 hidden w-fit rounded-xl bg-ctp-surface0/0 px-2 text-center backdrop-blur md:flex dark:bg-ctp-midnight'>
            <CopyrightTag />
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

export function SocialBox({ mobile }: { mobile?: boolean }) {
  return (
    <div
      className={`${mobile ? 'block md:hidden' : 'hidden md:block'} simple-color-trans w-full rounded-md border border-ctp-surface0 bg-ctp-base p-6 dark:border-ctp-base dark:bg-ctp-midnight`}
    >
      <SocialIconNav2 boxItems={SOCIALS_FULL} />
    </div>
  );
}

export function SubscribeBox({ mobile }: { mobile?: boolean }) {
  return (
    <div
      className={`sidebar-box ${mobile ? 'flex md:hidden' : 'hidden md:flex md:w-full'} simple-color-trans min-w-full flex-col gap-4 bg-ctp-base p-6 dark:bg-ctp-midnight`}
    >
      <h4 className='flex-wrap text-balance text-3xl font-black'>Articles delivered right to your feed reader.</h4>
      <Link
        target='_blank'
        href='/atom.xml'
        type='application/atom+xml'
        className='font-mono font-bold text-ctp-base hover:text-ctp-base hover:no-underline'
      >
        <p className='color-trans-quick flex w-full flex-row items-center justify-center gap-[1ch] rounded bg-ctp-mauve px-4 py-2 hover:bg-ctp-pink'>
          <span>subscribe</span>
          <span>|</span>
          <span className='flex flex-row items-center'>
            <span className='icon-[ph--atom] text-2xl' /> <span className='icon-[ph--rss] text-2xl' />
          </span>
        </p>
      </Link>
    </div>
  );
}
