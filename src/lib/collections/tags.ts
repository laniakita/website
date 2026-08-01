import { loader } from "fumadocs-core/source";
import { defineCollections } from "fumadocs-mdx/macro";
import matter from "gray-matter";
import * as z from "zod";
import { descriptionHelper } from "../description-helper";

const tags = defineCollections({
	dir: "./content/tags",
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
			date: z.coerce.date().default(new Date()),
			url: z
				.string()
				.default(
					`${ctx.path.split("content").pop()?.split(".").shift()?.toLowerCase()}`,
				),
			description: z.string().default(() => {
				const content = matter(ctx.source);
				const url = `${ctx.path.split("content").pop()?.split(".").shift()?.toLowerCase()}`;
				return (
					descriptionHelper(content.content, url, true) ?? "Tag description"
				);
			}),
		});
	},
});

export const tagsSource = loader({
	baseUrl: "/tags",
	source: tags.toFumadocsSource(),
});
