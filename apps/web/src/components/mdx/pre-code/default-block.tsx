'use client';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useId, useRef, useState } from 'react';
import CopyBtn, { handlePreScroll, handlePreScrollDefault } from './copy-button';

export default function DefaultBlock(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);

  useEffect(() => {
    try {
      eval(';'); // This line will throw an error if JavaScript is disabled
      setIsJavaScriptEnabled(true);
    } catch {
      // No need to set state here, it's already false by default
    }
  }, []);

  return isJavaScriptEnabled ? <DefaultBlockComponent {...props} /> : <pre {...props} />;
}
function DefaultBlockComponent(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState<boolean | null>(false);
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const preId = `expandable-codesnippet${blockSerial}`;
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
    <div className='relative'>
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
      />
    </div>
  );
}
