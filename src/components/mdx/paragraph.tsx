import React, { type ReactElement, type ReactNode } from 'react';

export function Paragraph(props: { children?: ReactNode }) {
  if (typeof props.children !== 'string') {
    if (
      typeof (props.children as ReactElement).type === 'function' ||
      (props.children as ReactElement).type === 'img'
    ) {
      return <>{props.children}</>;
    }
  }
  return <p {...props} />;
}
