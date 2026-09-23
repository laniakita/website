import { defineCollections } from "fumadocs-mdx/config";
import * as z from "zod";

export const authors = defineCollections({
	dir: "./.content/authors",
	type: "doc",
	schema: (ctx) => {
		return z.object({
			createdAt: z.coerce.date().default(new Date()),
			lastModified: z.coerce.date().optional(),
			name: z.string(),
			bluesky: z.string().optional(),
			mastodon: z.string().optional(),
			github: z.string().optional(),
			url: z
				.string()
				.default(`${ctx.path.split(".content").pop()?.split(".").shift()}`),
		});
	},
});
