import { defineConfig } from "fumadocs-mdx/config";
import nix from "highlight.js/lib/languages/nix";
import { common } from "lowlight";
import rehypeFnCitationSpacer from "rehype-fn-citation-spacer";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightLines from "rehype-highlight-code-lines";
import remarkGfm from "remark-gfm";
import { remarkImgProcessor } from "./src/scripts/remark-img-processor";

export { blog, feed } from "./schema/blog";
export { categories } from "./schema/categories";
export { tags } from "./schema/tags";
export { works } from "./schema/works";
export { authors } from "./schema/authors";
export { pages } from "./schema/pages";

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: false,
		remarkPlugins: (v) => [
			remarkGfm,
			[
				remarkImgProcessor,
				{
					addLqipAttribute: true,
				},
			],
			...v,
		],
		rehypePlugins: (v) => [
			rehypeFnCitationSpacer,
			[rehypeHighlight, { languages: { ...common, nix } }],
			[
				rehypeHighlightLines,
				{
					showLineNumbers: true,
					lineContainerTagName: "div",
				},
			],
			...v,
		],
	},
});
