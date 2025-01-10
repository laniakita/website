'use client';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useId, useRef, useState } from 'react';
import CopyBtn, { handlePreScroll } from './copy-button';

export default function DefaultCodeBlock(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const blockId = `codesnippet${blockSerial}container`;
  const preId = `codesnippet${blockSerial}`;

  const [isCopied, setIsCopied] = useState<boolean | null>(false);

  // handle weird singleline blocks
  // const preRef = useRef<HTMLPreElement>(null!);
  const [topPos, setTopPos] = useState('top-2');

  useEffect(() => {
    //console.log(preRef.current);
    //console.log(preRef.current.getClientRects());
    if (preRef?.current !== undefined) {
      if ((preRef.current.getClientRects()?.[0]?.height ?? 0) < 70) {
        setTopPos('top-2');
      } else {
        setTopPos('top-4');
      }
    }
  }, []);

  return (
    <>
      <figure id={blockId} className='relative'>
        <CopyBtn
          preRef={preRef}
          btnRef={btnRef}
          setIsCopied={setIsCopied}
          topPos={topPos}
          isCopied={isCopied}
          special='pointer-events-auto'
        />
        <pre
          {...props}
          id={preId}
          ref={preRef}
          onScroll={() => {
            handlePreScroll(btnRef);
          }}
        >
          {props.children}
        </pre>
      </figure>
    </>
  );
}
