'use client';
import React, { ReactElement, Suspense, useEffect, useId, useRef, useState } from 'react';

export default function CodeBlockCopier(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
) {
  return (
    <Suspense>
      <CodeBlockAssemble {...props} />
    </Suspense>
  );
}

function CodeBlockAssemble(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  if ((props.children as ReactElement).type === 'code') {
    const inputBlock = props.children as PreCodeBlock;
    interface PreCodeBlock extends ReactElement {
      props: {
        children: Object[];
      };
    }

    // string is a weird edge case here.
    if (inputBlock.props.children.length > 30 && typeof inputBlock.props.children !== 'string') {
      const [isExpanded, setIsExpanded] = useState(false);
      const [codeHeight, setCodeHeight] = useState(0);

      const codeBlockRef = useRef<HTMLDivElement>(null!);
      const preRef = useRef<HTMLPreElement>(null!);
      const overlayRef = useRef<HTMLDivElement>(null!);

      const collapsedBlock = {
        ...inputBlock,
        props: {
          ...inputBlock.props,
          children: inputBlock.props.children.slice(0, 15),
        },
      };

      const blockSerial = useId();
      const blockId = `codeblock-${blockSerial}`;
      const preId = `pre-${blockId}`;
      //console.log(inputBlock.props.children.length, blockId);

      useEffect(() => {
        // init codeHeight
        if (codeHeight <= 0 && codeBlockRef.current.offsetHeight > codeHeight) {
          setCodeHeight(codeBlockRef.current.offsetHeight);
        }
        codeBlockRef.current.style.height = codeHeight + 'px';
      }, [isExpanded, codeHeight]);

      const handleExpand = () => {
        setIsExpanded(true);
        // get expanded height;
        // timeout necessary, otherwise it uses the collapsed height
        setTimeout(() => {
          //console.log('await getting height');
          setCodeHeight(preRef.current.offsetHeight);
        }, 50);
      };

      return (
        <div
          ref={codeBlockRef}
          id={blockId}
          className='relative my-[1.5rem] overflow-y-hidden [transition:_height_0.8s_ease]'
        >
          <div ref={overlayRef} className='pointer-events-none absolute inset-0'>
            <button className='pointer-events-auto absolute right-4 top-4 flex items-center justify-center rounded-md border border-ctp-overlay0 bg-ctp-mantle/20 p-2 text-center text-ctp-overlay1 backdrop-blur'>
              <span className='icon-[ph--clipboard-text] h-[1.5rem] w-[1.5rem]' />
            </button>

            <div
              className={`absolute ${isExpanded ? 'hidden' : ''} inset-x-0 bottom-0 flex h-full max-h-[50%] w-full items-center justify-center overflow-x-auto rounded-b-lg bg-ctp-mantle/20 bg-gradient-to-b from-transparent to-ctp-base text-center text-ctp-overlay0 dark:to-ctp-midnight`}
            >
              <button
                onClick={() => handleExpand()}
                className='pointer-events-auto flex w-fit flex-row items-center rounded-lg border border-ctp-mauve bg-ctp-mauve/10 p-4 text-ctp-mauve shadow-lg backdrop-blur-sm [transition:_color_0.3s,_border_0.3s,_box-shadow_0.3s,_backdrop-filter_0.3s,_background_0.3s] hover:border-ctp-pink hover:bg-ctp-pink/10 hover:text-ctp-pink hover:shadow-xl hover:backdrop-blur'
              >
                {`</> show code`}
              </button>
            </div>
          </div>

          <pre ref={preRef} id={preId} className='my-0' {...props}>
            {isExpanded ? props.children : collapsedBlock}
          </pre>
        </div>
      );
    }

    // handle weird singleline blocks
    const nonCollapsedPreRef = useRef<HTMLPreElement>(null!);
    const [topPos, setTopPos] = useState('top-4');

    useEffect(() => {
      console.log()
      if (nonCollapsedPreRef.current.childNodes.length == 2 && nonCollapsedPreRef.current.childNodes[1]?.childNodes) {
        if (nonCollapsedPreRef.current.childNodes[1]?.childNodes.length <= 3) {
          if(nonCollapsedPreRef.current.childNodes[1]?.childNodes[0]?.nodeName === "DIV") {
            if( nonCollapsedPreRef.current.childNodes[1]?.childNodes.length === 1) {
              setTopPos('top-2');
            }
          }
        }
      }
    },[])

    return (
      <div className='relative'>
        <pre ref={nonCollapsedPreRef} {...props}>
        <button className={`pointer-events-auto absolute right-4 ${topPos} flex items-center justify-center rounded-md border border-ctp-overlay0 bg-ctp-mantle/20 p-1 text-center text-ctp-overlay1 backdrop-blur`}>
              <span className='icon-[ph--clipboard-text] h-[1.5rem] w-[1.5rem]' />
            </button>
          {props.children}
        </pre>
      </div>
    );
  }

  return <pre {...props} />;
}
