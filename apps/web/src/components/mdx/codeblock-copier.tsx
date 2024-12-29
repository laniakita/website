'use client';
import React, { ReactElement, useState } from 'react';

export default function CodeBlockCopier(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
) {
  const [isExpanded, setIsExpanded] = useState(false);

  interface PreCodeBlock extends ReactElement {
    props: {
      children: Object[];
    };
  }

  if ((props.children as ReactElement).type === 'code') {
    const inputBlock = props.children as PreCodeBlock;
    if (inputBlock.props.children.length > 30) {
      //console.log(inputBlock)
      const collapsedBlock = {
        ...inputBlock,
        props: {
          ...inputBlock.props,
          children: inputBlock.props.children.slice(0, 15),
        },
      };

      return (
        <div className={`relative ${isExpanded ? '' : ''}`}>
          <pre {...props}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='absolute right-4 top-4 flex items-center justify-center rounded-md border border-ctp-overlay0 bg-ctp-mantle/20 p-2 text-center text-ctp-overlay0 backdrop-blur'
            >
              <span className='icon-[ph--clipboard-text] text-2xl' />
            </button>
            <div
              className={`absolute ${isExpanded ? 'hidden' : ''} inset-x-0 bottom-0 flex h-full items-center justify-center rounded-b-lg bg-ctp-mantle/20 bg-gradient-to-b from-transparent via-transparent to-ctp-midnight text-center text-ctp-overlay0`}
            >
              <button 
              
              onClick={() => setIsExpanded(!isExpanded)}
              className='w-fit bg-ctp-sapphire flex flex-row items-center p-4 rounded-lg'>
                <span className='icon-[ph--clipboard-text] text-2xl' />
                show code
              </button>
            </div>
            {isExpanded ? props.children : collapsedBlock}
          </pre>
        </div>
      );
    }
  }

  return (
    <div className='relative'>
      <pre {...props}>
        <button className='absolute right-4 top-4 flex items-center justify-center rounded-md border border-ctp-overlay0 bg-ctp-mantle/20 p-2 text-center text-ctp-overlay0 backdrop-blur'>
          <span className='icon-[ph--clipboard-text] text-2xl' />
        </button>
        {props.children}
      </pre>
    </div>
  );
}
