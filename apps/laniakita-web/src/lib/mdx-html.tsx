import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import { useMDXComponent } from 'next-contentlayer2/hooks';

function EzMdx({mdxCode}:{mdxCode: string}) {
  const Component = useMDXComponent(mdxCode);
  return <Component code={mdxCode} />
}

function jsxToHtml(mdxCode: string) {
  const component = <EzMdx mdxCode={mdxCode} />
  const res = renderToStaticMarkup(component)
  return res;
};

export default jsxToHtml;
