import type { ReactElement, ReactNode } from 'react';

export function Paragraph(props: { children?: ReactNode }) {
  if (typeof props.children !== 'string') {
    if (
      typeof (props.children as ReactElement).type === 'function' ||
      (props.children as ReactElement).type === 'img'
    ) {
      return <>{props.children}</>;
    }
  }
  if ((props.children as ReactElement[]).length > 1) {
    const nodeMap = Object.values((props.children as ReactElement[]))?.map((node) => {
      if (typeof node === 'string') {
        const spanNode = <span>{node}</span>
        return spanNode;
      }
      return node;
    });
    return <p {...props} key={crypto.randomUUID()}>{nodeMap}</p>
  }
  return (
    <p {...props} />
  );
}
