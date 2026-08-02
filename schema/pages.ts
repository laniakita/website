import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";

export const pages = defineCollections({
	dir: "./content/pages",
	type: "doc",
	schema: (ctx) => {
		return z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.coerce.date().default(new Date()),
			url: z
				.string()
				.default(`${ctx.path.split("content").pop()?.split(".").shift()}`),
		});
	},
});
