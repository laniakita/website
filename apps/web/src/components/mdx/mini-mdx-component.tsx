import { getMDXComponent } from './mdx-bundler-components';

export function MiniMDXComponent({ code }: { code: string }) {
  const MDXContent = getMDXComponent(code, {});
  return <MDXContent code={code} />;
}
