import path from "node:path";
import { applyMdxPreset, defineCollections } from "fumadocs-mdx/config";
import matter from "gray-matter";
import rehypeFnCitationSpacer from "rehype-fn-citation-spacer";
import remarkGfm from "remark-gfm";
import * as v from "valibot";
import {
	remarkImgProcessor,
	type RemarkImgProcessorOptions,
} from "../src/scripts/remark-img-processor";
import { descriptionHelper } from "./description-helper";
import {
	coerceDate,
	featuredImageSchema,
	inlineImagesSchema,
	optionalDate,
	taxonomyItemSchema,
} from "./shared";

const postSchema = (ctx: { path: string; source: string }) => {
	return v.object({
		id: v.string(),
		headline: v.string(),
		subheadline: v.optional(v.string()),
		createdAt: coerceDate,
		lastModified: optionalDate,
		author: v.string(),
		imageSrc: v.optional(v.string()),
		altText: v.optional(v.string()),
		caption: v.optional(v.string()),
		catSlugs: v.optional(v.array(v.string())),
		categories: v.optional(v.array(taxonomyItemSchema)),
		tagSlugs: v.optional(v.array(v.string())),
		tags: v.optional(v.array(taxonomyItemSchema)),
		keywords: v.optional(v.array(v.string())),
		url: v.optional(
			v.string(),
			() => path.join("/blog", `${ctx.path.split("/").pop()?.split(".").shift()}`),
		),
		description: v.optional(v.string(), () => {
			const content = matter(ctx.source);
			const url = path.join(
				"/blog",
				`${ctx.path.split("/").pop()?.split(".").shift()?.toLowerCase()}`,
			);
			return descriptionHelper(content.content, url) ?? "Post description";
		}),
		featured_image: featuredImageSchema,
		inlineImages: inlineImagesSchema(ctx),
	});
};

export const blog = defineCollections({
	type: "doc",
	dir: "./.content/posts",
	schema: postSchema,
});

export const feed = defineCollections({
	type: "doc",
	dir: "./.content/posts",
	schema: postSchema,
	mdxOptions: applyMdxPreset({
		rehypeCodeOptions: false,
		remarkImageOptions: false,
		// biome-ignore lint/suspicious/noExplicitAny: We don't have the exported type.
		remarkPlugins: (v: any) => [
			remarkGfm,
			[
				remarkImgProcessor,
				{ addLqipAttribute: false } satisfies RemarkImgProcessorOptions,
			],
			...v,
		],
		// biome-ignore lint/suspicious/noExplicitAny: We don't have the exported type.
		rehypePlugins: (v: any) => [rehypeFnCitationSpacer, ...v],
	}),
});

