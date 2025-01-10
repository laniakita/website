import { ReactElement } from 'react';

interface PreCodeBlock extends ReactElement {
  props: {
    children: ReactElement[];
  };
}

interface NumberedCodeBlockProps {
  className: string;
  'data-line-number': string;
  children: string | string[] | HTMLSpanElement | HTMLSpanElement[];
}

export const codeCollapser = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
  if ((props.children as ReactElement).type === 'code') {
    const codeBlock = props.children as PreCodeBlock;
    if (typeof codeBlock.props.children !== 'string' && codeBlock.props.children?.[0]?.type === 'div') {
      if (
        'data-line-number' in
          (codeBlock.props.children[codeBlock.props.children.length - 1]?.props as NumberedCodeBlockProps) &&
        parseInt(
          (codeBlock.props.children[codeBlock.props.children.length - 1]?.props as NumberedCodeBlockProps)[
            'data-line-number'
          ],
        ) -
          20 >=
          40
      ) {
        return {
          ...codeBlock,
          props: {
            ...codeBlock.props,
            children: codeBlock.props.children.slice(0, 15),
          },
        };
      }
    }
  }
  return undefined;
};
