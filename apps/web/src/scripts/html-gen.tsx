import React from 'react';
import { renderToString } from 'react-dom/server';
//import {evaluate} from '@mdx-js/mdx'
//import * as runtime from 'react/jsx-runtime'
//import { createElement } from 'react';
import { MDXContent } from "@content-collections/mdx/react";
/*
export const htmlGenS = async (mdxStr: string, url: string) => {
  const mdx = await evaluate(mdxStr, {
    ...runtime,
    baseUrl: url
  })
  return renderToString(createElement(mdx.default));
}
*/

export async function HtmlCode(mdxCode: string) {
  return renderToString(<MDXContent code={mdxCode} />);
}