import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImgReplacer } from "./post-img";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		img: ImgReplacer,
		Image: ImgReplacer,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
