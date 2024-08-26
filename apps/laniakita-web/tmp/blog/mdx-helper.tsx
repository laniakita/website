import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

function MDXComponent({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={{}} />;
}

export function mdxStr(code: string) {
  const str = <MDXComponent code={code} />;
  const html = renderToStaticMarkup(str);
  return html;
}
