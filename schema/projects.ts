import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";

export const projects = defineCollections({
	type: "doc",
	dir: "./.content/projects",
	schema: (ctx) => {
		return z.object({
			id: z.string(),
			date: z.coerce.date(),
			updated: z.coerce.date().optional(),
			title: z.string(),
			tech: z.array(z.string()),
			imageSrc: z.string().optional(),
			altText: z.string().optional(),
			caption: z.string().optional(),
			description: z.string(),
			altDescription: z.string().optional(),
			blogPost: z.string().optional(),
			embedded: z.boolean(),
			foreignUrl: z.string().optional(),
			url: z
				.string()
				.default(`${ctx.path.split(".content").pop()?.split(".").shift()}`),
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
		});
	},
});
