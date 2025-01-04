'use client';
import React, {
  type ReactElement,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from 'react';

export default function CodeBlockCopier(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
) {
  return (
    <Suspense>
      <CodeBlockAssemble {...props} />
    </Suspense>
  );
}
interface PreCodeBlock extends ReactElement {
  props: {
    children: object[];
  };
}
function CodeBlockAssemble(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if ((props.children as ReactElement).type === 'code') {
    const inputBlock = props.children as PreCodeBlock;

    // string is a weird edge case here.
    if (inputBlock.props.children.length > 30 && typeof inputBlock.props.children !== 'string') {
      if (isClient) return <ExpandableBlock {...props} />;
      return <CollapsedCodeBlock {...props} />;
    }
    return <DefaultCodeBlock {...props} />;
  }

  return <pre {...props} />;
}

function CollapsedCodeBlock(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  // refs
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const blockId = `codeblock-${blockSerial}`;
  const preId = `pre-${blockId}`;

  const [isCopied, setIsCopied] = useState<boolean | null>(false);

  const inputBlock = props.children as PreCodeBlock;

  const collapsedBlock = {
    ...inputBlock,
    props: {
      ...inputBlock.props,
      children: inputBlock.props.children.slice(0, 15),
    },
  };

  const handlePreScroll = (insideCollapsedBlock?: boolean, isExpanded?: boolean) => {
    if (!insideCollapsedBlock || isExpanded === true) {
      btnRef.current.style.pointerEvents = 'none';
      btnRef.current.style.opacity = '0';
      setTimeout(() => {
        btnRef.current.style.pointerEvents = 'auto';
        btnRef.current.style.opacity = '100%';
      }, 500);
    } else if (insideCollapsedBlock && !isExpanded) {
      btnRef.current.style.opacity = '0';
      setTimeout(() => {
        btnRef.current.style.opacity = '20%';
      }, 500);
    }
  };

  // handle weird singleline blocks
  //const preRef = useRef<HTMLPreElement>(null!);

  return (
    <div id={blockId} className='relative'>
      <pre
        id={preId}
        ref={preRef}
        onScroll={() => {
          handlePreScroll();
        }}
        {...props}
      >
        <CopyBtn
          preRef={preRef}
          btnRef={btnRef}
          setIsCopied={setIsCopied}
          isExpanded={false}
          topPos={'top-4'}
          isCopied={isCopied}
          special='pointer-events-auto'
        />
        {collapsedBlock}
      </pre>
    </div>
  );
}

function DefaultCodeBlock(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  // refs
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const blockId = `codeblock-${blockSerial}`;
  const preId = `pre-${blockId}`;

  const [isCopied, setIsCopied] = useState<boolean | null>(false);

  const handlePreScroll = (insideCollapsedBlock?: boolean, isExpanded?: boolean) => {
    if (!insideCollapsedBlock || isExpanded === true) {
      btnRef.current.style.pointerEvents = 'none';
      btnRef.current.style.opacity = '0';
      setTimeout(() => {
        btnRef.current.style.pointerEvents = 'auto';
        btnRef.current.style.opacity = '100%';
      }, 500);
    } else if (insideCollapsedBlock && !isExpanded) {
      btnRef.current.style.opacity = '0';
      setTimeout(() => {
        btnRef.current.style.opacity = '20%';
      }, 500);
    }
  };

  // handle weird singleline blocks
  //const preRef = useRef<HTMLPreElement>(null!);
  const [topPos, setTopPos] = useState('top-4');

  useEffect(() => {
    //console.log(preRef.current);
    //console.log(preRef.current.getClientRects());
    if ((preRef.current.getClientRects()?.[0]?.height ?? 0) < 70) {
      setTopPos('top-2');
    } else {
      setTopPos('top-4')
    }
  }, []);

  return (
    <div id={blockId} className='relative'>
      <pre
        id={preId}
        ref={preRef}
        onScroll={() => {
          handlePreScroll();
        }}
        {...props}
      >
        <CopyBtn
          preRef={preRef}
          btnRef={btnRef}
          setIsCopied={setIsCopied}
          topPos={topPos}
          isCopied={isCopied}
          special='pointer-events-auto'
        />
        {props.children}
      </pre>
    </div>
  );
}

function ExpandableBlock(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState<boolean | null>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [codeHeight, setCodeHeight] = useState(0);
  const codeBlockRef = useRef<HTMLDivElement>(null!);
  const preRef = useRef<HTMLPreElement>(null!);
  const btnRef = useRef<HTMLButtonElement>(null!);
  const blockSerial = useId();
  const blockId = `codeblock-${blockSerial}`;
  const preId = `pre-${blockId}`;

  const inputBlock = props.children as PreCodeBlock;

  const collapsedBlock = {
    ...inputBlock,
    props: {
      ...inputBlock.props,
      children: inputBlock.props.children.slice(0, 15),
    },
  };

  const handlePreScroll = (insideCollapsedBlock?: boolean, isExpanded?: boolean) => {
    if (!insideCollapsedBlock || isExpanded === true) {
      btnRef.current.style.pointerEvents = 'none';
      btnRef.current.style.opacity = '0';
      setTimeout(() => {
        btnRef.current.style.pointerEvents = 'auto';
        btnRef.current.style.opacity = '100%';
      }, 500);
    } else if (insideCollapsedBlock && !isExpanded) {
      btnRef.current.style.opacity = '0';
      setTimeout(() => {
        btnRef.current.style.opacity = '20%';
      }, 500);
    }
  };

  //console.log(inputBlock.props.children.length, blockId);

  useEffect(() => {
    // init codeHeight
    if (codeHeight <= 0 && codeBlockRef.current.offsetHeight > codeHeight) {
      setCodeHeight(codeBlockRef.current.offsetHeight);
    }
    if (codeHeight > 0) codeBlockRef.current.style.height = `${codeHeight}px`;
  }, [isExpanded, codeHeight]);

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
    <div ref={codeBlockRef} id={blockId} className='relative my-6 overflow-y-hidden [transition:_height_0.8s_ease]'>
      <div className='pointer-events-none absolute inset-0'>
        <CopyBtn
          preRef={preRef}
          btnRef={btnRef}
          setIsCopied={setIsCopied}
          topPos='top-4'
          isCopied={isCopied}
          special='pointer-events-none'
          isExpanded={isExpanded}
        />

        <div
          className={`absolute ${isExpanded ? 'hidden' : ''} inset-x-0 bottom-0 flex size-full max-h-[50%] items-center justify-center overflow-x-auto rounded-b-lg border border-t-0 border-ctp-surface0 bg-ctp-mantle/20 bg-gradient-to-b from-transparent to-ctp-base text-center text-ctp-overlay0 dark:to-ctp-midnight`}
        >
          <button
            onClick={() => {
              handleExpand();
            }}
            className='pointer-events-auto flex w-fit flex-row items-center rounded-lg border border-ctp-mauve bg-ctp-mauve/10 p-4 font-mono text-sm text-ctp-mauve shadow-lg backdrop-blur-sm [transition:_color_0.3s,_border_0.3s,_box-shadow_0.3s,_backdrop-filter_0.3s,_background_0.3s] hover:border-ctp-pink hover:bg-ctp-pink/10 hover:text-ctp-pink hover:shadow-xl hover:backdrop-blur'
          >
            {`</> show code`}
          </button>
        </div>
      </div>

      <pre
        ref={preRef}
        id={preId}
        onScroll={() => {
          handlePreScroll(true, isExpanded);
        }}
        className='my-0'
        {...props}
      >
        {isExpanded ? props.children : collapsedBlock}
      </pre>
    </div>
  );
}

function CopyBtn({
  preRef,
  btnRef,
  setIsCopied,
  topPos,
  isCopied,
  special,
  isExpanded,
}: {
  preRef: RefObject<HTMLPreElement>;
  btnRef: RefObject<HTMLButtonElement>;
  setIsCopied: Dispatch<SetStateAction<boolean | null>>;
  topPos?: string;
  isCopied: boolean | null;
  special?: string;
  isExpanded?: boolean;
}) {
  const handleCopyClick = () => {
    const code = preRef.current.innerText;
    if (code) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      console.log('copied code to clipboard');
    } else {
      setIsCopied(null);
      console.error('error: failed to copy code to clipboard (<pre/>.innerText not found)');
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 flex w-full flex-row items-center justify-end ${topPos ?? ''} gap-4 pr-4`}
    >
      <span
        className={`pointer-events-none flex min-w-2 rounded-full border border-ctp-base p-1 px-4 font-mono font-bold opacity-0 backdrop-blur-md [transition:_opacity_0.3s] ${isCopied ? 'pointer-events-auto border-ctp-green bg-ctp-green/20 text-ctp-green opacity-100 hover:border-ctp-green hover:bg-ctp-green/20 hover:text-ctp-green' : isCopied === null ? 'pointer-events-auto border-ctp-red bg-ctp-red/20 text-ctp-red opacity-100 hover:border-ctp-red hover:bg-ctp-red/20 hover:text-ctp-red' : ''} text-xs md:text-base`}
      >
        {isCopied ? 'Copied to clipboard!' : isCopied === null ? 'Error: Copying failed.' : ''}
      </span>

      <button
        ref={btnRef}
        onClick={handleCopyClick}
        className={`${special} flex items-center justify-center rounded-lg border p-1 shadow-lg backdrop-blur-md [transition:_color_0.3s,_border_0.3s,_box-shadow_0.3s,_backdrop-filter_0.3s,_background_0.3s,_opacity_0.3s] hover:shadow-xl hover:backdrop-blur ${isExpanded == true && 'pointer-events-auto opacity-100'} ${isExpanded == false && isExpanded !== undefined && 'pointer-events-none opacity-20'} ${isCopied ? 'border-ctp-green/[.99] bg-ctp-green/[.20] text-ctp-green/[.99] hover:border-ctp-green hover:bg-ctp-green/20 hover:text-ctp-green' : isCopied === null ? 'border-ctp-red bg-ctp-red/20 text-ctp-red hover:border-ctp-red hover:bg-ctp-red/20 hover:text-ctp-red' : 'border-ctp-mauve bg-ctp-mauve/20 text-ctp-mauve hover:border-ctp-pink hover:bg-ctp-pink/10 hover:text-ctp-pink'}`}
      >
        <span
          className={`${isCopied ? 'icon-[ph--check-fat-duotone] text-ctp-green hover:text-ctp-green' : isCopied === null ? 'icon-[ph--x-circle-duotone] text-ctp-red hover:text-ctp-red' : 'icon-[ph--copy-duotone]'} size-6`}
        />
      </button>
    </div>
  );
}
