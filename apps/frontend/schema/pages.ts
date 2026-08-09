import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";

export const pages = defineCollections({
	dir: "./.content/pages",
	type: "doc",
	schema: (ctx) => {
		return z.object({
			title: z.string(),
			description: z.string().optional(),
			createdAt: z.coerce.date().default(new Date()),
			lastModified: z.coerce.date().optional(),
			url: z
				.string()
				.default(`${ctx.path.split(".content").pop()?.split(".").shift()}`),
		});
	},
});
