import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
import DefaultBlock from './default-block';

export default function PreCodeV2(props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  if ((props.children as ReactElement)?.type === 'code') {
    return <DefaultBlock {...props} />;
  }

  return <pre {...props} />;
}
