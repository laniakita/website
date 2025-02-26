import { MDXContent } from "@content-collections/mdx/react";

export function MiniMDXComponent({ code }: { code: string }) {
  return <MDXContent code={code} />;
}
