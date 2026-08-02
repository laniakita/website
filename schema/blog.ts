import path from "node:path";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineCollections } from "fumadocs-mdx/config";
import matter from "gray-matter";
import rehypeFnCitationSpacer from "rehype-fn-citation-spacer";
import remarkGfm from "remark-gfm";
import * as z from "zod";
import { descriptionHelper } from "./description-helper";
import { fetchData } from "./utils";

const postSchema = (ctx: { path: string; source: string }) => {
	return z.object({
		id: z.string(),
		headline: z.string(),
		subheadline: z.string().optional(),
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		author: z.string(),
		imageSrc: z.string().optional(),
		altText: z.string().optional(),
		caption: z.string().optional(),
		catSlugs: z.array(z.string()).optional(),
		categories: z
			.array(
				z.object({
					title: z.string().or(z.undefined()),
					url: z.string().or(z.undefined()),
					type: z.string(),
				}),
			)
			.default([{ title: undefined, url: undefined, type: "category" }]),
		tagSlugs: z.array(z.string()).optional(),
		tags: z
			.array(z.object({ title: z.string(), url: z.string(), type: z.string() }))
			.default([{ title: "", url: "", type: "tag" }]),
		keywords: z.array(z.string()).optional(),
		url: z
			.string()
			.default(
				path.join("/blog", `${ctx.path.split("/").pop()?.split(".").shift()}`),
			),
		description: z.string().default(() => {
			const content = matter(ctx.source);
			const url = path.join(
				"/blog",
				`${ctx.path.split("/").pop()?.split(".").shift()?.toLowerCase()}`,
			);
			return descriptionHelper(content.content, url) ?? "Post description";
		}),
		featured_image: z
			.object({
				hasImage: z.boolean(),
				src: z.string(),
				base64: z.string(),
				height: z.number(),
				width: z.number(),
				resized: z.string(),
				altText: z.string(),
				caption: z.string(),
				_debug: z
					.object({
						destination: z.string(),
						status: z.object({
							exists: z.boolean(),
							existsInPublic: z.boolean(),
						}),
						didCopy: z.string(),
						reason: z.string(),
					})
					.or(z.null()),
			})
			.default(() => {
				const data = fetchData(ctx.path);
				return data.data.featured_image;
			}),
	});
};

export const blog = defineCollections({
	type: "doc",
	dir: "./content/posts",
	schema: postSchema,
});

export const feed = defineCollections({
	type: "doc",
	dir: "./content/posts",
	schema: postSchema,
	mdxOptions: applyMdxPreset({
		rehypeCodeOptions: false,
		// biome-ignore lint/suspicious/noExplicitAny: We don't have the exported type.
		remarkPlugins: (v: any) => [remarkGfm, ...v],
		// biome-ignore lint/suspicious/noExplicitAny: We don't have the exported type.
		rehypePlugins: (v: any) => [rehypeFnCitationSpacer, ...v],
	}),
});
