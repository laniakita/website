/** @jsxImportSource react */
import type { ReactElement, DetailedHTMLProps, HTMLProps } from 'react';
import * as ReactDomServer from 'react-dom/server';
import { resMdx } from './utils';
import { getMDXComponent } from './mdx-bundler-components';

function Paragraph(props: DetailedHTMLProps<HTMLProps<HTMLParagraphElement>, HTMLParagraphElement>) {
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

export default async function jsxToHtml(markdown: string, contentDir: string, folderPath: string) {
  const mdxCode = await resMdx(markdown, contentDir, folderPath);
  const res5 = ReactDomServer.renderToStaticMarkup(<EzMdx mdxCode={mdxCode.code} />);
  return res5;
}
