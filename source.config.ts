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
export { projects } from "./schema/projects";
export { works } from "./schema/works";
export { authors } from "./schema/authors";
export { pages } from "./schema/pages";

import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: false,
		remarkPlugins: (v) => [
			remarkGfm,
			[
				remarkImgProcessor,
				{
					generatePlaiceholder: true,
					r2Endpoint: env.R2_ENDPOINT_URL || process.env.R2_ENDPOINT_URL,
					r2Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
					r2AccessKey: env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID,
					r2SecretKey: env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY,
					r2PublicUrl: env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL,
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
