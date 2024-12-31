import React, { ReactElement, ReactNode } from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import * as _jsx_dev_runtime from 'react/jsx-dev-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactDOM from 'react-dom';
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
  const Component = getMDXComponent(mdxCode, {});
  return <Component code={mdxCode} components={mdxComponents} />;
}

function jsxToHtml(mdxCode: string) {
  const component = <EzMdx mdxCode={mdxCode} />;
  const res = renderToStaticMarkup(component);
  return res;
}

function getMDXComponent(code: string, globals: Record<string, unknown>) {
  const mdxExport = getMDXExport(code, globals);
  return mdxExport.default;
}

function getMDXExport(code: string, globals: Record<string, unknown>) {
  const scope = {
    React,
    ReactDOM,
    _jsx_runtime: process.env.NODE_ENV === 'production' ? _jsx_runtime : _jsx_dev_runtime,
    ...globals,
  };
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope));
}

export default jsxToHtml;
