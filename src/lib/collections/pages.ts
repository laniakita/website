import { loader } from "fumadocs-core/source";
import { defineCollections } from "fumadocs-mdx/macro";
import * as z from "zod";

const pages = defineCollections({
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

export const pagesSource = loader({
	baseUrl: "/pages",
	source: pages.toFumadocsSource(),
});
