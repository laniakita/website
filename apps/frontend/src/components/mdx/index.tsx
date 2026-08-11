import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import Anchors from "./anchor-tags";
import { Heading } from "./heading";
import { Paragraph } from "./paragraph";
import { ImgReplacer } from "./post-img";
import PreCodeV2 from "./pre-code/codeblock-v2";
import SectionCore from "./section/section";

/* */
export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		p: Paragraph,
		img: ImgReplacer,
		Image: ImgReplacer,
		pre: PreCodeV2,
		a: Anchors,
		section: SectionCore,
		h1: (props) => <Heading as='h1' {...props} />,
		h2: (props) => <Heading as='h2' {...props} />,
		h3: (props) => <Heading as='h3' {...props} />,
		h4: (props) => <Heading as='h4' {...props} />,
		h5: (props) => <Heading as='h5' {...props} />,
		h6: (props) => <Heading as='h6' {...props} />,
		...components,
	} as MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
