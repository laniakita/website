import React, { useId, type ReactElement, type ReactNode } from 'react';

export function Paragraph(props: { children?: ReactNode }) {
  const id = useId();

  if (typeof props.children !== 'string') {
    if (
      typeof (props.children as ReactElement).type === 'function' ||
      (props.children as ReactElement).type === 'img'
    ) {
      return <>{props.children}</>;
    }

    if ((props.children as ReactElement[]).length > 2) {
      const nodeMap = Object.values(props.children as ReactElement[])?.map((node) => {

        if (typeof node !== 'string') {
          if ('children' in (node.props as ReactElement)) {
            //console.log(node)
          }
          /*
          const spanNode = (
            <span key={crypto.randomUUID()} id={`span-${id}-${crypto.randomUUID()}`}>
              {node}
            </span>
          );
          return spanNode;
          */
        }

        //return node;
      });
      //return <p key={crypto.randomUUID()} id={`paragraph-${id}`} {...{ children: nodeMap }} />;
    }
  }

  return <p {...props} />;
}
