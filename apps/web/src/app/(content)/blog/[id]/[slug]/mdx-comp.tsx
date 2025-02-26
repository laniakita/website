'use client'

import { getMDXComponent } from "mdx-bundler/dist/client";
import { useMemo } from "react";

export function MDXComponent({code}:{code: string}) {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <Component />
  );

}