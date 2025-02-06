'use client'

import { SocialIconNavProps } from "@/components/social-icon";
import { ReactNode, useRef } from "react";
import { useIntersectionObserver } from "./utils";
import { NoiseShader01View } from "../projects/(three)/shaders/noise/01/noise";
import { socialItemsV } from "@/lib/socials-data";
import TextSplitterUltra from "@/components/text-splitter-v2";

export function SocialIconNav3({ boxItems }: SocialIconNavProps) {
  return (
    <div className='flex grid-cols-none flex-row items-center gap-2 md:grid md:grid-cols-3 md:gap-x-1 md:gap-y-0 xl:flex xl:gap-2'>
      {boxItems.map((item) => (
        // eslint-disable-next-line react/jsx-no-target-blank -- noreferrer is used...
        <a
          key={crypto.randomUUID()}
          rel={item.title.toLowerCase() === 'mastodon' ? 'me' : 'noreferrer'}
          href={item.url}
          className='items-center justify-center text-ctp-text color-trans-quick hover:text-ctp-pink md:text-ctp-subtext0'
          target='_blank'
          aria-label={`Follow Lani on ${item.linkName}`}
        >
          <span className={`${item.iconName} ${item.textSize} pointer-events-none`} />
        </a>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <div className='relative -mt-16 flex h-[80dvh] w-full items-end justify-start overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <NoiseShader01View />
      </div>
      <div className='relative inset-x-0 z-10 flex w-full animate-fade-in border-t border-ctp-base bg-ctp-base/80 px-6 opacity-0 backdrop-blur-xl color-trans-quick dark:border-ctp-text dark:bg-ctp-base/50'>
        <div className='@container/main m-auto flex w-full max-w-5xl flex-row gap-x-10 py-10'>
          <div className=''>
            <h1 className='text-5xl font-black text-ctp-text uppercase'>Lani Akita</h1>
            <h2 className='text-2xl font-medium uppercase'>Full Stack Developer</h2>
          </div>

          <div className='h-auto min-h-full w-0.5 overflow-visible bg-ctp-text' />

          <div className='my-auto hidden md:flex md:flex-col xl:flex-row xl:gap-2'>
            <SocialIconNav3 boxItems={socialItemsV.slice(0, 3)} />
            <SocialIconNav3 boxItems={socialItemsV.slice(3, 6)} />
          </div>
        </div>
      </div>
    </div>
  );
}

type HomeSectionProps = {
  title: string,
  page?: number,
  markdown: string,
  children?: ReactNode
}

export function HomeSection(props: HomeSectionProps) {
  const divRef = useRef(null!);
  const visible = useIntersectionObserver(divRef);

  return (
    <div ref={divRef} aria-current={visible} className='group absolute max-w-5xl w-full flex flex-row items-center' style={{ top: props.page ? `${props.page * 100}dvh` : undefined }}>
      <div className="w-1/2 space-y-10">
        <h1 className={`text-4xl font-bold overflow-hidden`}>
          <TextSplitterUltra 
            spanRole="heading"
            level={1}
            textIn={props.title}
            reverse={!visible}
            charClass={`${visible? 'animate-fade-in-up-ultra opacity-0' : 'animate-fade-out-down-ultra' } group-aria-[current=false]:[transition:_color_0.5s]  inline-block`} />
        </h1>
        <div className='prose-protocol-omega -mt-6'>
          <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
        </div>
      </div>
      <div className="w-1/2 pl-10">
        {props.children}
      </div>
    </div>

  );
}
