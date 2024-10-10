/* eslint-disable -- It works, deal with it. eslint stay mad. */
import React from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import * as _jsx_dev_runtime from 'react/jsx-dev-runtime';
import * as ReactDOM from 'react-dom'
import type {Jsx} from '@mdx-js/mdx'

export function getMDXComponent(code: string, globals: Record<string, unknown>) {
  const mdxExport = getMDXExport(code, globals)
  return mdxExport.default
}

function getMDXExport(code: string, globals: Record<string, unknown>) {
  const scope = {React, ReactDOM,   _jsx_runtime: process.env.NODE_ENV === 'production' ? _jsx_runtime as unknown as Jsx : _jsx_dev_runtime as unknown as Jsx, ...globals}
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope))
}

