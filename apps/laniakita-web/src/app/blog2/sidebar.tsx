import { SocialIconNav2 } from '@/components/social-icon';
import { allCategories, allTags, Category, Tag } from 'contentlayer/generated';
import Markdown from 'markdown-to-jsx';
import Link from 'next/link';

const blogInfo = `A blog about life, Linux, and web development. Written by, [Lani Akita](/about).`;

const socialItems = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-4xl',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com',
    iconName: 'icon-[fa6-brands--linkedin-in]',
    linkName: 'Linkedin!',
    textSize: 'text-4xl',
  },
  {
    title: 'Mastodon',
    url: 'https://hachyderm.io/@lani',
    iconName: 'icon-[fa6-brands--mastodon]',
    linkName: 'Mastodon!',
    textSize: 'text-4xl',
  },
  {
    title: 'Instagram',
    url: 'https://instagram.com',
    iconName: 'icon-[fa6-brands--instagram]',
    linkName: 'Instagram!',
    textSize: 'text-4xl',
  },
  {
    title: 'Patreon',
    url: 'https://patreon.com/Lani_Akita',
    iconName: 'icon-[fa6-brands--patreon]',
    linkName: 'Patreon!',
    textSize: 'text-3xl',
  },
  {
    title: 'RSS/Atom',
    url: '/feed.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-4xl',
  },
];

export default function Sidebar() {
  const categories = allCategories.sort((a, b) => a!.title!.localeCompare(b!.title!));
  const tags = allTags.sort((a, b) => a!.title!.localeCompare(b!.title!));

  return (
    <>
      {/* wrapper */}
      <div className='flex flex-col gap-2 md:gap-6'>
        <div className='sidebar-box flex flex-col gap-6'>
          <div className='prose-protocol-omega font-mono prose-p:my-0'>
            <Markdown options={{ forceBlock: true }}>{blogInfo}</Markdown>
          </div>
          <SocialIconNav2 boxItems={socialItems} />
        </div>
        <div className='sidebar-box flex flex-col gap-2 font-mono'>
          <div>
            <EzRoller title={'Categories'} array={categories} />
          </div>
          <div>
            <EzRoller title={'Tags'} array={tags} />
          </div>
        </div>
      </div>
    </>
  );
}

function EzRoller({ array, title }: { array: Category[] | Tag[]; title: string }) {
  return (
    <>
      <h4 className='font-bold'>{title}</h4>
      <div className='flex flex-wrap'>
        {array.map((arr, idx) => (
          <>
            <Link key={idx} href={arr.url} className='text-ctp-sapphire underline'>
              {arr.title}
            </Link>
            {idx < array.length - 1 ? <span className='pr-[1ch]'>{`,`}</span> : ''}
          </>
        ))}
      </div>
    </>
  );
}
