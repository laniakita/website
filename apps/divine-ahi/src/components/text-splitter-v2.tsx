import { type ComponentProps } from 'react';

interface TextSplitterUltraProps extends ComponentProps<'span'> {
  textIn: string;
  spanRole: string;
  charClass: string;
}

export default function TextSplitterUltra({ textIn, spanRole, charClass, ...spanProps }: TextSplitterUltraProps) {
  return (
    <span aria-label={textIn} role={spanRole} {...spanProps}>
      {textIn.split('').map((char, index) => {
        return (
          <span
            key={textIn.indexOf(char)}
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
