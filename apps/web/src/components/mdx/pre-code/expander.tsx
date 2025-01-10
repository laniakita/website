'use client'
import { DetailedHTMLProps, HTMLAttributes, useEffect, useId, useRef, useState } from "react";
import CopyBtn, { handlePreScroll } from "./copy-button";
import { codeCollapser } from "./util";

export default function ExpandableBlock(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const collapsedBlock = codeCollapser(props);
  const initExpanded = collapsedBlock == undefined ? true : false;
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);
  const [isCopied, setIsCopied] = useState<boolean | null>(false);
  const [isExpanded, setIsExpanded] = useState(initExpanded);
  const [codeHeight, setCodeHeight] = useState(0);
  const codeBlockRef = useRef<HTMLElement>(null!);
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const blockId = `expandable-codesnippet${blockSerial}container`;
  const preId = `expandable-codesnippet${blockSerial}`;
  const overlayId = `expandable-codesnippet-overlay${blockSerial}`;
  const [topPos, setTopPos] = useState('top-2');
  useEffect(() => {
    try {
      eval(';'); // This line will throw an error if JavaScript is disabled
      setIsJavaScriptEnabled(true);
    } catch {
      // No need to set state here, it's already false by default
    }
  }, [])

  useEffect(() => {
    if (!isJavaScriptEnabled) return;

    //console.log(preRef.current);
    //console.log(preRef.current.getClientRects());
    if (preRef?.current !== undefined) {
      if ((preRef?.current?.getClientRects()?.[0]?.height ?? 0) < 70) {
        setTopPos('top-2');
      } else {
        setTopPos('top-4');
      }
    }
  }, [isJavaScriptEnabled]);

  useEffect(() => {
    // init codeHeight
    if (!isJavaScriptEnabled) return;
    if (!initExpanded) {
      if (codeHeight <= 0 && codeBlockRef.current.offsetHeight > codeHeight) {
        setCodeHeight(codeBlockRef.current.offsetHeight);
      }
      if (codeHeight > 0) codeBlockRef.current.style.height = `${codeHeight}px`;
    }
  }, [isExpanded, codeHeight, initExpanded, isJavaScriptEnabled]);

  const handleExpand = () => {
    setIsExpanded(true);
    // get expanded height;
    // timeout necessary, otherwise it uses the collapsed height
    setTimeout(() => {
      //console.log('await getting height');
      setCodeHeight(preRef.current.offsetHeight);
      btnRef.current.style.opacity = '100%';
    }, 50);
  };

  return (
    <figure ref={codeBlockRef} id={blockId} className={`relative my-6 overflow-y-hidden motion-safe:[transition:_height_0.8s_ease]`}>
      {initExpanded ? (
        <CopyBtn
          preRef={preRef}
          btnRef={btnRef}
          setIsCopied={setIsCopied}
          topPos={topPos}
          isCopied={isCopied}
          special={`${isJavaScriptEnabled ? 'block' : 'hidden'} pointer-events-none`}
          isExpanded={isExpanded}
        />
      ) : (
        <div id={overlayId} className={`${isJavaScriptEnabled ? 'block' : 'hidden'} pointer-events-none absolute inset-0`}>
          <CopyBtn
            preRef={preRef}
            btnRef={btnRef}
            setIsCopied={setIsCopied}
            topPos={topPos}
            isCopied={isCopied}
            special='pointer-events-none'
            isExpanded={isExpanded}
          />

          <div
            className={`absolute ${isExpanded ? 'hidden' : ''} inset-x-0 bottom-0 flex size-full max-h-[80%] items-center justify-center overflow-x-auto rounded-b-lg border border-t-0 border-ctp-surface0 bg-ctp-mantle/20 bg-gradient-to-b from-transparent to-ctp-base text-center text-ctp-overlay0 dark:to-ctp-midnight`}
          >
            <button
              onClick={() => {
                handleExpand();
              }}
              className='pointer-events-auto flex w-fit flex-row items-center rounded-lg border border-ctp-mauve bg-ctp-mauve/10 p-4 font-mono text-sm text-ctp-mauve shadow-lg backdrop-blur-sm hover:border-ctp-pink hover:bg-ctp-pink/10 hover:text-ctp-pink hover:shadow-xl hover:backdrop-blur motion-safe:[transition:_color_0.3s,_border_0.3s,_box-shadow_0.3s,_backdrop-filter_0.3s,_background_0.3s]'
            >
              {`</> show code`}
            </button>
          </div>
        </div>)}
      {isJavaScriptEnabled ?
        (<pre
          ref={preRef}
          id={preId}
          onScroll={() => {
            handlePreScroll(btnRef, true, isExpanded);
          }}
          className='my-0'
          {...{ ...props, children: isExpanded ? props.children : collapsedBlock }}
        />) : (
          <pre
            {...props}
          />
        )
      }
    </figure>
  );
}
