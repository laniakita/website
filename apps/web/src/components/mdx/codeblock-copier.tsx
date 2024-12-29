import React from 'react';

export default function CodeBlockCopier(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>,
) {
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
