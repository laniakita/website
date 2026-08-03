import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";

export const works = defineCollections({
	type: "doc",
	dir: "./.content/works",
	schema: (ctx) => {
		return z.object({
			id: z.string(),
			startDate: z.coerce.date(),
			endDate: z.coerce.date().optional(),
			title: z.string(),
			domain: z.string(),
			active: z.boolean(),
			tech: z.array(z.string()),
			imageSrc: z.string().optional(),
			altText: z.string().optional(),
			url: z
				.string()
				.default(`${ctx.path.split(".content").pop()?.split(".").shift()}`),
			featured_image: z
				.object({
					src: z.string(),
					css: z.string(),
					height: z.number(),
					width: z.number(),
					localHash: z.string(),
					altText: z.string().optional(),
				})
				.optional(),
		});
	},
});
