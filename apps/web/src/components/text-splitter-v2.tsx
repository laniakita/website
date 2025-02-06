import { type ComponentProps } from 'react';

interface TextSplitterUltraProps extends ComponentProps<'span'> {
  textIn: string;
  spanRole: string;
  level: number;
  charClass: string;
  reverse?: boolean;
}

export default function TextSplitterUltra({
  textIn,
  spanRole,
  charClass,
  level,
  reverse,
  ...spanProps
}: TextSplitterUltraProps) {
  return (
    <span aria-label={textIn} role={spanRole} aria-level={level} {...spanProps}>
      {textIn.split('').map((char, index) => {
        return (
          <span
            key={crypto.randomUUID()}
            className={`${char === ' ' ? 'mx-[0.2ch]' : ''} ${charClass}`}
            style={{ animationDelay: reverse ? `${1.5-index/10}s` : `${0.1 + index / 10}s` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
