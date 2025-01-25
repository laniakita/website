import type { Metadata } from 'next';
import Link from 'next/link';
import NoiseShader01 from '@/app/projects/(three)/shaders/noise/01/noise';
import { type SocialIconNavProps } from '@/components/social-icon';
import { RESUME_LINK } from '@/lib/constants';
import { socialItems2 } from '@/components/sidebar/main';
import Navbar from '@/components/navbar/variants/v2/core';
import Footer from '@/components/footer/footer';
import Markdown from 'markdown-to-jsx';

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


function PsuedoArrayMarkup({ arr, lastKey, horizontal }: { arr: string[]; lastKey?: boolean; horizontal?: boolean }) {
  return (
    <span className={`inline-flex ${horizontal ? 'flex-wrap' : 'flex-col'}`}>
      {`[`}
      {arr.map((item, idx) => (
        <span key={crypto.randomUUID()}>
          <strong className={`landing-hero-string ${horizontal ? 'px-[1ch]' : 'pl-[2ch]'}`}>{`"${item}"`}</strong>{idx < arr.length - 1 && <span className={`${horizontal ? 'ml-[-1ch]' : ''} `}>,</span>}
        </span>
      ))}
      {`]${!lastKey && ','}`}
    </span>
  )
}

function Hero() {
  return (
    <div className='relative -mt-16 flex h-[40rem] w-full items-center justify-center '>
      <div className='absolute inset-0 z-0'>
        <NoiseShader01 />
      </div>
      <div className='p-2'>
        <div className='color-trans-quick z-10 flex max-w-[25rem] animate-fade-in flex-col rounded-lg border border-ctp-base bg-ctp-base/80 p-10 opacity-0 backdrop-blur-xl dark:border-ctp-text dark:bg-ctp-base/50'>
          <h1 className='font-mono text-3xl text-ctp-text md:text-4xl'>{`<`}<strong className='font-black text-ctp-sky dark:text-ctp-blue'>LaniAkita</strong>{` />`}</h1>
          <span className='my-6 h-[2px] w-full rounded bg-ctp-text dark:bg-ctp-text' />
          <h2 className='mb-2 text-2xl font-bold md:text-3xl'>Full Stack Developer</h2>
          <h3 className='text-pretty font-mono font-semibold text-ctp-green md:text-lg'><em>&quot;Specializing in Bleeding-edge Web Technologies&quot;</em></h3>
        </div>
      </div>
    </div>
  );
}

// because I've been _building, breaking, learning, fixing, deploying, optimizing, refactoring, testing, integrating, re-deploying,_ web applications since I was about 12, I've become quite familar with the entire _stack_. Back-end, Front-end, Infra, you name it, I've probably thought a lot about it.
// From architecting the backend infra, to creating Back-end APIs designed to deploy at the Edge, to using frontend libraries like React (or Svelte) to deliver polished, _stateful_, blazing fast frontends for a full-stack Next.js (or SvelteKit) application, to deploying on said infra, I'm there.`;



function Summary() {
  const summaryMd = `
  ## Hello, I'm Lani

  My name is Lani Akita, and I'm a Full Stack Developer from Honolulu, Hawai'i. I'm someone whose dedicated herself to building (and now writing about) stuff for the Internet. 

  What that means, is that sometimes I'm creating, deploying, and or maintaining websites for Clients. Other times, I'm creating, publishing, and or maintaining open-source libraries/software for myself and others across the Net to use. Either way, I'm working (& thinking) across the entire stack to accomplish _that_.
  `
  return (
    <div>
      <div className='px-6 pb-10'>
        <div className='prose-protocol-omega'>
          {/* eslint-disable-next-line react/no-children-prop -- this is expected
            @ts-expect-error -- types issue? */}
          <Markdown children={summaryMd} />
        </div>
      </div>
    </div>
  );
}

const main_langs = ['TypeScript', 'Rust', 'Python'];
const main_toolset = ['Next.js', 'React', 'Svelte', 'Bun', 'Node.js'];
const interests = ['Accessibility', 'Scalability', 'IaC', 'WebAssembly', 'WebGL'];

export default function HomeV2() {



  return (
    <>
      <Navbar />
      <Hero />
      <Summary />
      <Footer />
    </>
  );
}


/*            <p className='landing-hero-prop'>role: <strong className='landing-hero-string'>&quot;Full Stack Developer&quot;<span className='landing-hero-prop'>,</span></strong></p>

            <p className='landing-hero-prop'>specialty: <strong className='landing-hero-string'>&quot;Bleeding-edge Web Technologies&quot;</strong></p>
  *
  *            <p className='landing-hero-prop'>main_langs: <PsuedoArrayMarkup {...{ arr: main_langs, horizontal: true }} /> </p>
            <p className='landing-hero-prop'>main_toolset: <PsuedoArrayMarkup {...{ arr: main_toolset, horizontal: true}} /></p>
            <p className='landing-hero-prop'>interests: <PsuedoArrayMarkup {...{ arr: interests }} /></p>
  *
  *function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'>
      {boxItems.map((item) => (
        <Link
          key={crypto.randomUUID()}
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

            <div className='simple-color-trans flex w-full items-center justify-between gap-4 rounded-md border border-ctp-pink bg-ctp-base/70 p-4 shadow-2xl backdrop-blur-md md:flex-row md:bg-ctp-base/60 md:p-2 lg:pr-4 dark:border-ctp-sapphire/40 dark:bg-ctp-midnight/70'>
              <div className='flex w-full flex-col md:flex-row md:justify-between'>
                <div className='flex w-full flex-col flex-wrap items-center gap-2 md:w-fit md:max-w-[30rem] md:flex-row xl:max-w-full'>
                  <Link href='/about' className='home-btn-2'>
                    <p className=''>About Me</p>
                  </Link>
                  <Link href='/work' className='home-btn-2'>
                    <p>My Work</p>
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
                <div className='mt-1.5 hidden md:flex md:flex-col xl:flex-row xl:gap-2'>
                  <SocialIconNav3 boxItems={socialItems2.slice(0, 3)} />
                  <SocialIconNav3 boxItems={socialItems2.slice(3, 6)} />
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center md:hidden'>
              <SocialIconNav3 boxItems={socialItems2} />
            </div>
          </div>
        </div>


*/
