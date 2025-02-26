import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { evaluate } from '@mdx-js/mdx'
import { createElement } from 'react'

export async function generate (body: string, url: URL) {
  const { default: mdx } = await evaluate(body, {
    // eslint-disable-next-line -- types?
    ...runtime as any,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
    baseUrl: url
  })

  return renderToString(createElement(mdx))
}