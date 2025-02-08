'use client';

import { ReactNode, useRef } from 'react';
import { useIntersectionObserver } from '../../utils';
import TextSplitterUltra from '@/components/text-splitter-v2';
import slugify from '@/utils/slugify';
type HomeSectionProps = {
  title: string;
  page?: number;
  markdown: string;
  children?: ReactNode;
  type?: number;
};

export default function Section(props: HomeSectionProps) {
  const divRef = useRef(null!);
  const visible = useIntersectionObserver(divRef);

  if (!props.type) {
    return (
      <section
        ref={divRef}
        aria-current={visible}
        className='group @container/sec relative z-20 mx-auto w-full max-w-5xl px-6 py-40'
      >
        <div className='flex flex-col items-center @3xl/sec:flex-row'>
          <div className='w-full space-y-10 @3xl:w-1/2'>
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
              className={`${visible ? 'motion-safe:animate-fade-in-slide-right motion-safe:opacity-0' : 'motion-safe:animate-fade-out-slide-left'} prose-protocol-omega -mt-6 max-w-full`}
            >
              <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
            </div>
          </div>
          <div className={`w-full @3xl/sec:w-1/2 @3xl/sec:pl-10`}>{props.children}</div>
        </div>
      </section>
    );
  }

  if (props.type === 1) {
    return (
      <section
        ref={divRef}
        aria-current={visible}
        className='group @container/sec relative'
      >

        <div className='py-20 shadow-2xl dark:shadow-ctp-mauve z-20'>
          <div className='px-6 max-w-5xl w-full mx-auto'>
            <div className='w-full space-y-10 @3xl:w-1/2'>
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
                className={`${visible ? 'motion-safe:animate-fade-in-slide-right motion-safe:opacity-0' : 'motion-safe:animate-fade-out-slide-left'} prose-protocol-omega -mt-6 max-w-full`}
              >
                <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
              </div>
            </div>
          </div>
        </div>

        <div>
          {props.children}
        </div>
      </section >
    );
  }


  if (props.type === 2) {
    return (
      <section
        ref={divRef}
        aria-current={visible}
        className='group @container/sec relative py-40'
      >

        <div className='z-20 pb-20'>
          <div className='px-6 max-w-5xl w-full mx-auto'>
            <div className='w-full space-y-10 @3xl:w-1/2'>
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
                className={`${visible ? 'motion-safe:animate-fade-in-slide-right motion-safe:opacity-0' : 'motion-safe:animate-fade-out-slide-left'} prose-protocol-omega -mt-6 max-w-full`}
              >
                <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
              </div>
            </div>
          </div>
        </div>

        <div className='px-6'>
          {props.children}
        </div>
      </section >
    );
  }

}
