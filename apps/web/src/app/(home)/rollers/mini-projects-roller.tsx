'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, wrap } from 'motion/react';
import { projects } from '$/.source';
import Image from 'next/image';
import Link from 'next/link';
import { APP_URL, SHOWCASE_URL } from '@/lib/constants';
import LocalDate from '@/app/(content)/blog/local-date';

type AllProjectsProps = typeof projects;

const projVariant = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
export default function MiniProjectsRoller({ allProjects }: { allProjects: AllProjectsProps }) {
  const menuRef = useRef<HTMLDivElement>(null!);
  const [waitProgress, setWaitProgress] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  const [userAction, setUserAction] = useState(false);

  const projIndex = wrap(0, allProjects.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const paginate = (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    };

    const interval = setInterval(
      () => {
        if (waitProgress < 100) {
          if (projIndex === prevIndex) {
            setWaitProgress((state) => state + 0.5);
          }
        } else {
          paginate(1);
          setWaitProgress(0);
        }

        setPrevIndex(projIndex);
        setUserAction(false);
      },
      userAction ? 10000 : 50,
    );

    return () => clearInterval(interval);
  }, [prevIndex, projIndex, waitProgress, page, userAction]);

  return (
    <>
      <div className='relative h-px'>
        <motion.div
          className='absolute inset-0 h-px origin-left bg-ctp-pink transition-all'
          style={{ scaleX: `${waitProgress}%` }}
        />
      </div>
      <div
        ref={menuRef}
        className='relative flex size-full h-[70vh] max-h-[70vh] items-center justify-center overflow-hidden'
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            variants={projVariant}
            custom={direction}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
                setUserAction(true);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
                setUserAction(true);
              }
            }}
            className='absolute inset-0 max-h-[70vh] overflow-hidden'
          >
            {allProjects[projIndex]?.featured_image && (
              <Image
                src={allProjects[projIndex].featured_image.src}
                placeholder='blur'
                blurDataURL={allProjects[projIndex].featured_image.base64}
                alt={allProjects[projIndex].featured_image.altText}
                fill
                className='pointer-events-none inset-0 max-w-screen object-cover'
              />
            )}
          </motion.div>

          <div
            key='buttons'
            className='pointer-events-none flex w-full max-w-5xl items-center justify-between px-6 text-5xl'
          >
            <motion.button
              whileHover={{
                scale: 1.2,
                backgroundColor: 'var(--color-ctp-pink)',
              }}
              className='pointer-events-auto left-10 z-2 icon-[ph--arrow-circle-left-fill]'
              onClick={() => {
                paginate(-1);
                setUserAction(true);
              }}
              aria-label='view next project'
            />
            <motion.button
              whileHover={{
                scale: 1.2,
                backgroundColor: 'var(--color-ctp-pink)',
              }}
              className='pointer-events-auto right-10 z-2 icon-[ph--arrow-circle-right-fill]'
              onClick={() => {
                paginate(1);
                setUserAction(true);
              }}
              aria-label='view next project'
            />
          </div>

          <div key='mobile-main' className='pointer-events-none absolute inset-0 z-3 flex'>
            <div className='flex w-full flex-col items-center justify-between'>
              <div className='w-full border-b border-ctp-surface0 bg-ctp-crust/80 shadow-xl backdrop-blur-md'>
                <div className='mx-auto flex max-w-5xl flex-col items-start justify-center px-6 py-4'>
                  <h4 className='pr-5 text-2xl font-black text-balance'>
                    <Link
                      href={
                        allProjects[projIndex]?.foreignUrl
                          ? allProjects[projIndex].foreignUrl
                          : !allProjects[projIndex]?.foreignUrl && !allProjects[projIndex]?.embedded
                            ? `${SHOWCASE_URL}${allProjects[projIndex]?.url}`
                            : `${APP_URL}${allProjects[projIndex]?.url}`
                      }
                      target='_blank'
                      className='pointer-events-auto text-ctp-text'
                    >
                      <span className='relative'>
                        {allProjects[projIndex]?.title}
                        <span className='absolute bottom-1 ml-px icon-[ph--arrow-up-right-bold] text-xl' />
                      </span>
                    </Link>
                  </h4>

                  <p className='font-mono text-xs'>
                    <LocalDate date={allProjects[projIndex]?.date ?? new Date()} />
                  </p>
                </div>
              </div>

              <div className='w-full border-t border-ctp-surface0 bg-ctp-crust/80 py-4 shadow-lg backdrop-blur-md'>
                <div className='mx-auto max-w-5xl space-y-2 px-6'>
                  <p className='text-sm text-pretty @3xl:max-w-1/2 @3xl:text-base'>
                    {allProjects[projIndex]?.description}
                  </p>
                  <div className='h-px w-full bg-ctp-surface0' />
                  <div className='flex flex-row gap-[1ch] @3xl:max-w-1/2'>
                    <p className='text-balance'>
                      {allProjects[projIndex]?.tech?.map((tag, idx) => (
                        <span key={`${crypto.randomUUID()}-mobile`} className='w-fit font-mono text-xs font-semibold'>
                          {tag}
                          {allProjects[projIndex]?.tech && idx < allProjects[projIndex]?.tech.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}
