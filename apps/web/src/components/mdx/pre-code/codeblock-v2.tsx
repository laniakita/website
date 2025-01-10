import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
import ExpandableBlock from './expander';

export default function PreCodeV2(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  if ((props.children as ReactElement)?.type === 'code') {
    return <ExpandableBlock {...props} />;
  }

  return <pre {...props} />;
}
