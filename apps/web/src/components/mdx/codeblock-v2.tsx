import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
//import DefaultCodeBlock from "./pre-code/default";
import ExpandableBlock from './pre-code/expander';

export default function PreCodeV2(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  if ((props.children as ReactElement)?.type === 'code') {
    return <ExpandableBlock {...props} />;
  }

  return <pre {...props} />;
}
