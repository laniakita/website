import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";
import { fetchData } from "./utils";

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
	},
});
