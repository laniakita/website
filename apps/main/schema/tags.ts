import { defineCollections } from "fumadocs-mdx/config";
import matter from "gray-matter";
import * as z from "zod";
import { descriptionHelper } from "./description-helper";

export const tags = defineCollections({
	dir: "./.content/tags",
	type: "doc",
	schema: (ctx) => {
		return z.object({
			id: z.string().optional(),
			title: z.string().default("tag"),
			slug: z
				.string()
				.default(
					`${ctx.path.split("/").pop()?.split(".").shift()?.toLowerCase()}`,
				),
			type: z.string().optional(),
			createdAt: z.coerce.date().default(new Date()),
			lastModified: z.coerce.date().optional(),
			url: z
				.string()
				.default(
					`${ctx.path.split(".content").pop()?.split(".").shift()?.toLowerCase()}`,
				),
			description: z.string().default(() => {
				const content = matter(ctx.source);
				const url = `${ctx.path.split(".content").pop()?.split(".").shift()?.toLowerCase()}`;
				return (
					descriptionHelper(content.content, url, true) ?? "Tag description"
				);
			}),
		});
	},
});
