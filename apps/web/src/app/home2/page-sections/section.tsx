'use client';

import { ReactNode, useRef } from 'react';
import { useIntersectionObserver } from '../utils';
import TextSplitterUltra from '@/components/text-splitter-v2';
import slugify from '@/utils/slugify';
type HomeSectionProps = {
  title: string;
  page?: number;
  markdown: string;
  children?: ReactNode;
};

export default function Section(props: HomeSectionProps) {
  const divRef = useRef(null!);
  const visible = useIntersectionObserver(divRef);

  return (
    <div ref={divRef} aria-current={visible} className='group flex w-full max-w-5xl flex-col items-center md:flex-row'>
      <div className='w-full space-y-10 md:w-1/2'>
        <h1 id={slugify(props.title)} className={`overflow-hidden text-4xl font-bold`}>
          <TextSplitterUltra
            spanRole='heading'
            level={1}
            textIn={props.title}
            reverse={!visible}
            charClass={`${visible ? 'motion-safe:animate-fade-in-up-ultra motion-safe:opacity-0' : 'motion-safe:animate-fade-out-down-ultra'} inline-block`}
          />
        </h1>
        <div
          className={`${visible ? 'motion-safe:animate-fade-in-slide-right motion-safe:opacity-0' : 'motion-safe:animate-fade-out-slide-left'} prose-protocol-omega -mt-6`}
        >
          <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
        </div>
      </div>
      <div
        className={`${visible ? 'opacity-0 motion-safe:animate-big-fade-in-up' : 'motion-safe:animate-big-fade-down'} w-full md:w-1/2 md:pl-10`}
      >
        {props.children}
      </div>
    </div>
  );
}
