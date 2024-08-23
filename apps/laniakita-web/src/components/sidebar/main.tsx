import { allCategories, allTags } from 'contentlayer/generated';
import InfoBox from './info-box';

const socialItems = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com',
    iconName: 'icon-[fa6-brands--linkedin-in]',
    linkName: 'Linkedin!',
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
    title: 'Instagram',
    url: 'https://instagram.com',
    iconName: 'icon-[fa6-brands--instagram]',
    linkName: 'Instagram!',
    textSize: 'text-3xl md:text-4xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-2xl md:text-3xl',
  },
  {
    title: 'RSS/Atom',
    url: '/feed.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-3xl md:text-4xl',
  },
];

const blogInfo = "A blog about life, Linux, and web development. Written by, [Lani Akita](/about).";

export default function Sidebar() {
  const categories = allCategories.sort((a, b) => a.title!.localeCompare(b.title!));
  const tags = allTags.sort((a, b) => a.title!.localeCompare(b.title!));

  return (
    <div className='flex flex-col gap-2 md:gap-6'>
      <InfoBox categories={categories} tags={tags} socialItems={socialItems} blogInfo={blogInfo} />
    </div>
  );
}
