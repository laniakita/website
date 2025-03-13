'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import TextSplitterUltra from '@/components/text-splitter-v2';
import slugify from '@/utils/slugify';
import { HomeSectionProps } from '.';

interface SummarySecProps extends HomeSectionProps {
  summaryCodeMarkdown: string;
}

export function SummarySection(props: SummarySecProps) {
  const divRef = useRef(null!);

  return (
    <section ref={divRef} className='group @container/sec relative z-20 mx-auto w-full max-w-5xl px-6 py-40'>
      <div className='flex flex-col items-center @3xl/sec:flex-row'>
        <div className='w-full space-y-10 @3xl:w-1/2'>
          <h1 id={slugify(props.title)} className={`overflow-hidden text-4xl font-bold`}>
            <TextSplitterUltra spanRole='heading' level={1} textIn={props.title} />
          </h1>
          <motion.div
            initial={{ opacity: 0, transform: 'translate3d(-10rem, 0rem, 0rem)' }}
            whileInView={{
              opacity: 1,
              transform: 'translate3d(0rem, 0rem, 0rem)',
              transition: {
                duration: 0.8,
                delay: 0,
                ease: [0.87, 0, 0.13, 1],
              },
            }}
            viewport={{ once: true }}
            className={`prose-protocol-omega -mt-6 max-w-full`}
          >
            <div dangerouslySetInnerHTML={{ __html: props.markdown }} />
          </motion.div>
        </div>
        <div className={`w-full @3xl/sec:w-1/2 @3xl/sec:pl-10`}>
          <SummaryCode code={props.summaryCodeMarkdown} />
        </div>
      </div>
    </section>
  );
}

function SummaryCode({ code }: { code: string }) {
  const figureRef = useRef<HTMLElement>(null!);

  return (
    <motion.figure
      ref={figureRef}
      initial={{ opacity: 0, transform: 'translate3d(0rem, 20%, 0rem)' }}
      whileInView={{
        opacity: 1,
        transform: 'translate3d(0rem, 0%, 0rem)',
        transition: {
          duration: 0.8,
          delay: 0,
          ease: 'backOut',
        },
      }}
      viewport={{ once: true }}
      className={`relative z-10 size-full`}
    >
      <div className='prose-protocol-omega mx-0 -mt-6 max-w-full' dangerouslySetInnerHTML={{ __html: code }} />
      <figcaption className='mx-0 px-0'>
        <strong>Fig. 01</strong>: Myself summarized as a JS object. The <em>snake_case</em> implies compatibility with a
        database, perhaps suggesting this object might be inserted into some database&apos;s table.
      </figcaption>
    </motion.figure>
  );
}
