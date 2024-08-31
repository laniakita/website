import Link from 'next/link';
import { allCategories, allTags } from 'contentlayer/generated';
import InfoBox from './info-box';

export const socialItems3 = [
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
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
  /*
  {
    title: 'Linkedin',
    url: 'https://linkedin.com',
    iconName: 'icon-[fa6-brands--linkedin-in]',
    linkName: 'Linkedin!',
    textSize: 'text-3xl md:text-4xl',
  },*/
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-3xl md:text-4xl',
  },
  /*
  {
    title: 'Instagram',
    url: 'https://instagram.com',
    iconName: 'icon-[fa6-brands--instagram]',
    linkName: 'Instagram!',
    textSize: 'text-3xl md:text-4xl',
  },*/
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-2xl md:text-3xl',
  },
  {
    title: 'Atom/RSS',
    url: '/atom.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-3xl md:text-4xl',
  },
];

const blogInfo = 'A blog about life, Linux, and web development. Written by, [Lani Akita](/about).';

export default function Sidebar() {
  const categories = allCategories.sort((a, b) => a.title!.localeCompare(b.title));
  const tags = allTags.sort((a, b) => a.title!.localeCompare(b.title));

  return (
    <div className='flex h-fit md:sticky md:top-24'>
      <div className='flex size-full h-fit max-h-[calc(100vh-6rem)] flex-col overflow-y-auto md:gap-6'>
        <InfoBox categories={categories} tags={tags} socialItems={socialItems2} blogInfo={blogInfo} />
        <SubscribeBox />
      </div>
    </div>
  );
}

export function SubscribeBox({ mobile }: { mobile?: boolean }) {
  return (
    <div className={`sidebar-box  ${mobile ? 'flex md:hidden' : 'hidden md:flex'}  flex-col gap-4 p-6`}>
      <h4 className='flex-wrap text-balance text-3xl font-black'>Articles delivered right to your feed reader.</h4>
      <Link href='/atom.xml' className='font-mono font-bold text-ctp-base hover:text-ctp-base hover:no-underline'>
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
