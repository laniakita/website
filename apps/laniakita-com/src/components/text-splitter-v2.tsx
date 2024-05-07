import { type ComponentProps } from 'react';

interface TextSplitterUltraProps extends ComponentProps<'span'> {
  textIn: string;
  spanRole: string;
  level: number;
  charClass: string;
}

export default function TextSplitterUltra({
  textIn,
  spanRole,
  charClass,
  level,
  ...spanProps
}: TextSplitterUltraProps) {
  return (
    <span aria-label={textIn} role={spanRole} aria-level={level} {...spanProps}>
      {textIn.split('').map((char, index) => {
        return (
          <span
            key={`${char}-${textIn.indexOf(char)}-${Math.random() * 10}`}
            className={`${char === ' ' ? 'mx-[0.2rem]' : ''} ${charClass}`}
            style={{ animationDelay: `${0.5 + index / 10}s` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
