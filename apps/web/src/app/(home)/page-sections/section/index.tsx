'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import TextSplitterUltra from '@/components/text-splitter-v2';
import slugify from '@/utils/slugify';

export type HomeSectionProps = {
  title: string;
  page?: number;
  markdown: string;
  children?: ReactNode;
  type?: number | string;
};

export default function Section(props: HomeSectionProps) {
  const divRef = useRef(null!);
  const isInView = useInView(divRef);

  if (props.type === 1) {
    return (
      <section ref={divRef} aria-current={isInView} className='group @container/sec relative'>
        <div className='z-20 py-20 shadow-2xl dark:shadow-ctp-mauve'>
          <div className='mx-auto w-full max-w-5xl px-6'>
            <div className='w-full space-y-10 @3xl:w-1/2'>
              <h1 id={slugify(props.title)} className={`overflow-hidden text-4xl font-bold`}>
                <TextSplitterUltra
                  spanRole='heading'
                  level={1}
                  textIn={props.title}
                  reverse={!isInView}
                  charClass={`${isInView ? 'motion-safe:animate-fade-in-up-ultra motion-safe:opacity-0' : 'motion-safe:animate-fade-out-down-ultra'} inline-block`}
                />
              </h1>
              <motion.div
                initial={{ opacity: 0, transform: 'translate3d(-10rem, 0rem, 0rem)' }}
                whileInView={{ opacity: 1, transform: 'translate3d(0rem, 0rem, 0rem)' }}
                viewport={{ once: true }}
                className={`prose-protocol-omega -mt-6 max-w-full`}
              >
                <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
              </motion.div>
            </div>
          </div>
        </div>

        <div>{props.children}</div>
      </section>
    );
  }

  if (props.type === 2) {
    return (
      <section ref={divRef} aria-current={isInView} className='group @container/sec relative py-40'>
        <div className='z-20 pb-20'>
          <div className='mx-auto w-full max-w-5xl px-6'>
            <div className='w-full space-y-10 @3xl:w-1/2'>
              <h1 id={slugify(props.title)} className={`overflow-hidden text-4xl font-bold`}>
                <TextSplitterUltra
                  spanRole='heading'
                  level={1}
                  textIn={props.title}
                  reverse={!isInView}
                  charClass={`${isInView ? 'motion-safe:animate-fade-in-up-ultra motion-safe:opacity-0' : 'motion-safe:animate-fade-out-down-ultra'} inline-block`}
                />
              </h1>
              <motion.div
                initial={{ opacity: 0, transform: 'translate3d(-10rem, 0rem, 0rem)' }}
                whileInView={{ opacity: 1, transform: 'translate3d(0rem, 0rem, 0rem)' }}
                viewport={{ once: true }}
                className={`prose-protocol-omega -mt-6 max-w-full`}
              >
                <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className='px-6'>{props.children}</div>
      </section>
    );
  }

  if (props.type === 'dev-for-hire') {
    return (
      <section
        ref={divRef}
        aria-current={isInView}
        className='group @container/sec relative z-20 mx-auto w-full max-w-5xl px-6 py-40'
      >
        <div className='flex flex-col items-center @3xl/sec:flex-row'>
          <div className='w-full space-y-10 @3xl:w-1/2'>
            <h1 id={slugify(props.title)} className={`overflow-hidden text-4xl font-bold`}>
              <TextSplitterUltra
                spanRole='heading'
                level={1}
                textIn={props.title}
                reverse={!isInView}
                charClass={`${isInView ? 'motion-safe:animate-fade-in-up-ultra motion-safe:opacity-0' : 'motion-safe:animate-fade-out-down-ultra'} inline-block`}
              />
            </h1>
            <motion.div
              initial={{ opacity: 0, transform: 'translate3d(-10rem, 0rem, 0rem)' }}
              whileInView={{ opacity: 1, transform: 'translate3d(0rem, 0rem, 0rem)' }}
              viewport={{ once: true }}
              className={`prose-protocol-omega -mt-6 max-w-full`}
            >
              <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
              <a
                href='mailto:me@laniakita.com'
                className={`flex w-full flex-row items-center justify-center rounded-md border border-ctp-sapphire bg-ctp-sapphire/20 px-4 py-4 font-mono text-sm font-bold text-balance text-ctp-sapphire no-underline hover:border-ctp-sapphire hover:bg-ctp-sky/40 hover:text-ctp-sky ${isInView ? 'opacity-0 motion-safe:animate-fade-in-down-slow' : 'motion-safe:animate-fade-out-down-ultra-down'} @3xl:py-4 @4xl:text-base`}
                style={{ animationDelay: '0.5s' }}
              >
                contact me
              </a>
            </motion.div>
          </div>
          <div className={`w-full @3xl/sec:w-1/2 @3xl/sec:pl-10`}>{props.children}</div>
        </div>
      </section>
    );
  }
}
