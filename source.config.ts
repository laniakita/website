import { defineConfig } from "fumadocs-mdx/config";
import nix from "highlight.js/lib/languages/nix";
import { common } from "lowlight";
import rehypeFnCitationSpacer from "rehype-fn-citation-spacer";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightLines from "rehype-highlight-code-lines";
import remarkGfm from "remark-gfm";

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: false,
		remarkPlugins: (v) => [remarkGfm, ...v],
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
