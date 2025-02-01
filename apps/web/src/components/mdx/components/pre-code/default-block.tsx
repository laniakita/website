'use client';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useId, useRef, useState } from 'react';
import CopyBtn, { handlePreScrollDefault } from './copy-button';

export default function DefaultBlock(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState<boolean | null>(false);
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const preId = `codesnippet${blockSerial}`;
  const [topPos, setTopPos] = useState('top-2');

  useEffect(() => {
    if (preRef?.current !== undefined) {
      if ((preRef?.current?.getClientRects()?.[0]?.height ?? 0) < 70) {
        setTopPos('top-2');
      } else {
        setTopPos('top-4');
      }
    }
  }, []);

  return (
    <div className='relative my-[calc(24em/14)]'>
      <CopyBtn
        preRef={preRef}
        btnRef={btnRef}
        setIsCopied={setIsCopied}
        topPos={topPos}
        isCopied={isCopied}
        isExpanded={true}
      />
      <pre
        ref={preRef}
        id={preId}
        onScroll={() => {
          handlePreScrollDefault(btnRef);
        }}
        {...props}
        className='my-0'
      ></pre>
    </div>
  );
}
