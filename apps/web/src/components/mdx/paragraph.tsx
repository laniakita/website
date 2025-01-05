import { useId, type ReactElement, type ReactNode } from 'react';

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
        if (typeof node === 'string') {
          //console.log(node);
          const spanNode = (
            <span key={crypto.randomUUID()} id={`span-${id}`}>
              {node}
            </span>
          );
          return spanNode;
        }
        return node;
      });

      return <p id={`paragraph-${id}`} key={crypto.randomUUID()} {...{ children: nodeMap }} />;
    }
  }

  return <p {...props} />;
}
