'use client';
import { useHash } from '@/components/use-hash';
import { DetailedHTMLProps, HTMLAttributes, LiHTMLAttributes, ReactElement, useEffect, useRef, useState } from 'react';

export default function SectionCore(props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      eval(';');
      setReady(true);
    } catch {
      // useless err block
    }
  }, []);

  if (ready && props.className === 'footnotes') {
    return <SectionFn {...props} />;
  }
  return <section {...props} />;
}

function SectionFn(props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const liRef = useRef<HTMLLIElement>(null!);
  const { hash } = useHash();
  const h2 = (props.children as ReactElement[])[0] as ReactElement<HTMLHeadingElement>;
  const currList = ((props.children as ReactElement[])[2] as unknown as ReactElement<HTMLAttributes<HTMLOListElement>>)
    ?.props?.children as ReactElement<HTMLLIElement>[];

  return (
    <section {...props}>
      {h2}
      <ol>
        {currList.map((item) =>
          item.props ? (
            <li
              key={item.props.id}
              ref={liRef}
              {...(item.props as unknown as LiHTMLAttributes<HTMLLIElement>)}
              className={`relative ${hash.substring(1) === item.props.id ? 'after:pointer-events-none after:absolute after:-inset-y-2 after:-right-4 after:-left-10 after:rounded-lg after:border after:border-ctp-mauve after:bg-ctp-mauve/20 after:opacity-100 after:transition-opacity after:duration-500' : 'after:opacity-0'}`}
            />
          ) : (
            ''
          ),
        )}
      </ol>
    </section>
  );
}
