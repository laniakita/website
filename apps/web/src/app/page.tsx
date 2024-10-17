import { useId } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import NoiseShader01 from '@/app/projects/(three)/shaders/noise/01/noise';
import { type SocialIconNavProps } from '@/components/social-icon';
import { RESUME_LINK } from '@/lib/constants';
import { socialItems2 } from '@/components/sidebar/main';
import NavBar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1200,
        height: 630,
        url: `/opengraph/home`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        alt: `Home Page`,
        type: 'image/png',
        width: 1600,
        height: 900,
        url: `/opengraph/home?twitter=true`,
      },
    ],
  },
};
/*
const socialItems3 = [
  {
    title: 'Github',
    url: 'https://github.com/laniakita',
    iconName: 'icon-[ant-design--github-filled]',
    linkName: 'Github!',
    textSize: 'text-4xl',
  },
  {
    title: 'Linkedin',
    url: 'https://linkedin.com/in/laniakita',
    iconName: 'icon-[fa6-brands--linkedin]',
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
    url: 'https://instagram.com/laniakita',
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
    title: 'Atom/RSS',
    url: '/atom.xml',
    iconName: 'icon-[ph--rss-bold]',
    linkName: 'your RSS/Atom feed reader!',
    textSize: 'text-4xl -ml-2',
  },
];
*/

function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  const uniqueKey = useId();
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 lg:flex lg:gap-2'>
      {boxItems.map((item, idx) => (
        <Link
          key={`social-icon-two-${uniqueKey}-${Math.floor(Math.random() * 1000 + idx)}`}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
          href={item.url}
          className='color-trans-quick items-center justify-center text-ctp-text hover:text-ctp-pink md:text-ctp-subtext0'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize}`} />
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main className='relative flex h-screen min-h-[40rem] w-full items-end justify-center md:min-h-[22rem]'>
        <div className='absolute inset-0'>
          <NoiseShader01 />
        </div>
        <div className='z-10 flex size-full flex-col items-center justify-end'>
          <div className='simple-color-trans flex w-full flex-col items-center justify-center gap-6 border-t border-ctp-surface0 bg-ctp-base/80 p-10 backdrop-blur-md md:items-start dark:bg-ctp-midnight/80'>
            <div className='simple-color-trans flex flex-col items-center justify-center whitespace-nowrap rounded-md md:w-fit md:justify-start'>
              <div className='w-fit'>
                <h1 className='text-4xl font-black uppercase md:text-6xl'>Lani Akita</h1>
                <h2 className='text-[1.09rem] font-semibold uppercase leading-none md:text-[1.82rem]'>
                  Full Stack Developer
                </h2>
              </div>
            </div>

            <div className='simple-color-trans flex w-full items-center justify-between gap-4 rounded-md border border-ctp-pink bg-ctp-base/70 p-4 shadow-2xl backdrop-blur-md md:flex-row md:bg-ctp-base/60 md:p-2 dark:border-ctp-sapphire/40 dark:bg-ctp-midnight/70'>
              <div className='flex w-full flex-col md:flex-row md:justify-between'>
                <div className='flex w-full flex-col flex-wrap items-center gap-2 md:w-fit md:max-w-[30rem] md:flex-row lg:max-w-full'>
                  <Link href='/about' className='home-btn-2'>
                    <p className=''>About Me</p>
                  </Link>
                  <Link href='/projects' className='home-btn-2'>
                    <p>My Projects</p>
                  </Link>
                  <Link href={RESUME_LINK} className='home-btn-2'>
                    <p>My Résumé</p>
                  </Link>
                  <Link href='/blog' className='home-btn-2'>
                    <p>Read the Blog</p>
                  </Link>
                  <Link href='/contact' className='home-btn-2-extra'>
                    <p>Contact Me</p>
                  </Link>
                </div>
                <div className='-mb-1.5 hidden w-fit md:flex md:min-w-28 lg:px-0'>
                  <SocialIconNav3 boxItems={socialItems2} />
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center md:hidden'>
              <SocialIconNav3 boxItems={socialItems2} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}