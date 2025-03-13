'use client';
import { type ComponentProps } from 'react';
import { motion } from 'motion/react';

interface TextSplitterUltraProps extends ComponentProps<'span'> {
  textIn: string;
  spanRole: string;
  level: number;
}

export default function TextSplitterUltra({ textIn, spanRole, level }: TextSplitterUltraProps) {
  return (
    <motion.span key={crypto.randomUUID()} aria-label={textIn} role={spanRole} aria-level={level}>
      {textIn.split('').map((char, index) => {
        return (
          <motion.span
            key={crypto.randomUUID()}
            initial={{
              opacity: 0,
              transform: 'translate3d(0rem, 20%, 0rem)',
            }}
            whileInView={{
              opacity: 1,
              transform: 'translate3d(0rem, 0%, 0rem)',
              transition: {
                duration: 0.3,
                delay: (0.1 + index) / 10,
                ease: 'circIn',
              },
            }}
            viewport={{ once: true }}
            className={`${char === ' ' ? 'mx-[0.2ch]' : ''} inline-block`}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

interface TextSplitterUltraPropsV1 extends ComponentProps<'span'> {
  textIn: string;
  spanRole: string;
  level: number;
  charClass: string;
  reverse?: boolean;
}

export function TextSplitterUltraV1({
  textIn,
  spanRole,
  charClass,
  level,
  reverse,
  ...spanProps
}: TextSplitterUltraPropsV1) {
  return (
    <span aria-label={textIn} role={spanRole} aria-level={level} {...spanProps}>
      {textIn.split('').map((char, index) => {
        return (
          <span
            key={crypto.randomUUID()}
            className={`${char === ' ' ? 'mx-[0.2ch]' : ''} ${charClass}`}
            style={{ animationDelay: reverse ? `${1.5 - index / 10}s` : `${0.1 + index / 10}s` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
