import React, { type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMDXComponent } from 'next-contentlayer2/hooks';

/*
 * It was necessary to recreate the helper MDX components, because
 * I can't import other components properly. This is due to these
 * functions being imported via the contentlayer.config.ts.
 *
 * As well, since this is destined for feed readers, it might be
 * better to omit the replacement <img /> component in this 'EZ'
 * re-creation. Because the resultant markup is more "vanilla".
 * */
function Paragraph(props: { children?: ReactNode }) {
  if (typeof props.children !== 'string' && (props.children as ReactElement).type === 'img') {
    return <>{props.children}</>;
  }
  return <p {...props} />;
}

function EzMdx({ mdxCode }: { mdxCode: string }) {
  const mdxComponents = { p: Paragraph };
  const Component = useMDXComponent(mdxCode);
  return <Component code={mdxCode} components={mdxComponents} />;
}

function jsxToHtml(mdxCode: string) {
  const component = <EzMdx mdxCode={mdxCode} />;
  const res = renderToStaticMarkup(component);
  return res;
}

export default jsxToHtml;
