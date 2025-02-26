import { UniversalMDXComponent } from '@/components/mdx/global-mdx-components';

export default async function jsxToHtml(code: string) {
  const ReactDomServer = (await import('react-dom/server')).default;
  const res5 = ReactDomServer.renderToStaticMarkup(<UniversalMDXComponent code={code} />);
  return res5;
}


