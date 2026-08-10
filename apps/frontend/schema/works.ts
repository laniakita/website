import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";
import { extractImagesFromMdx } from "./image-extractor";

export const works = defineCollections({
	type: "doc",
	dir: "./.content/works",
	schema: (ctx) => {
		return z.object({
			id: z.string(),
			createdAt: z.coerce.date(),
			lastModified: z.coerce.date().optional(),
			title: z.string(),
			source: z
				.string()
				.default(`${ctx.path.split(".content").pop()?.split(".").shift()}`),
			type: z.enum(["client", "personal"]).default("personal"),
			active: z.boolean().default(false),
			links: z
				.array(
					z.object({
						label: z.string(),
						url: z.string(),
					}),
				)
				.optional(),
			tech: z.array(z.string()),
			imageSrc: z.string().optional(),
			altText: z.string().optional(),
			featured_image: z
				.object({
					src: z.string(),
					localHash: z.string(),
					imgData: z
						.object({
							css: z.string(),
							height: z.number(),
							width: z.number(),
						})
						.optional(),
					altText: z.string().optional(),
				})
				.optional(),
			inlineImages: z
				.array(
					z.object({
						src: z.string(),
						alt: z.string().optional(),
						title: z.string().optional(),
					}),
				)
				.default(() => {
					return extractImagesFromMdx(ctx.source, ctx.path);
				}),
		});
	},
});

