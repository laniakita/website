import { loader } from "fumadocs-core/source";
import { defineCollections } from "fumadocs-mdx/macro";
import * as z from "zod";

const authors = defineCollections({
	dir: "./content/authors",
	type: "doc",
	schema: (ctx) => {
		return z.object({
			date: z.coerce.date().default(new Date()),
			name: z.string(),
			bluesky: z.string().optional(),
			mastodon: z.string().optional(),
			github: z.string().optional(),
			url: z
				.string()
				.default(`${ctx.path.split("content").pop()?.split(".").shift()}`),
		});
	},
});

export const authorsSource = loader({
	baseUrl: "/authors",
	source: authors.toFumadocsSource(),
});
