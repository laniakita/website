import { defineCollections } from "fumadocs-mdx/config";
import matter from "gray-matter";
import * as z from "zod";
import { descriptionHelper } from "./description-helper";

export const categories = defineCollections({
	dir: "./.content/categories",
	type: "doc",
	schema: (ctx) => {
		return z.object({
			id: z.string().optional(),
			title: z.string().default("Category Page"),
			slug: z
				.string()
				.default(
					`${ctx.path.split("/").pop()?.split(".").shift()?.toLowerCase()}`,
				),
			type: z.string().default("category"),
			date: z.coerce.date().default(new Date()),
			url: z
				.string()
				.default(
					`${ctx.path.split(".content").pop()?.split(".").shift()?.toLowerCase()}`,
				),
			description: z.string().default(() => {
				const content = matter(ctx.source);
				const url = `${ctx.path.split(".content").pop()?.split(".").shift()?.toLowerCase()}`;
				return (
					descriptionHelper(content.content, url, true) ??
					"Category description"
				);
			}),
		});
	},
});
