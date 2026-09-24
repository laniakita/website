import { defineCollections } from "fumadocs-mdx/config";
import matter from "gray-matter";
import * as v from "valibot";
import { descriptionHelper } from "./description-helper";
import { defaultCreatedAt, optionalDate } from "./shared";

export const tags = defineCollections({
	dir: "./.content/tags",
	type: "doc",
	schema: (ctx) => {
		return v.object({
			id: v.optional(v.string()),
			title: v.optional(v.string(), "tag"),
			slug: v.optional(
				v.string(),
				() => `${ctx.path.split("/").pop()?.split(".").shift()?.toLowerCase()}`,
			),
			type: v.optional(v.string()),
			createdAt: defaultCreatedAt,
			lastModified: optionalDate,
			url: v.optional(
				v.string(),
				() =>
					`${ctx.path.split(".content").pop()?.split(".").shift()?.toLowerCase()}`,
			),
			description: v.optional(v.string(), () => {
				const content = matter(ctx.source);
				const url = `${ctx.path.split(".content").pop()?.split(".").shift()?.toLowerCase()}`;
				return (
					descriptionHelper(content.content, url, true) ?? "Tag description"
				);
			}),
		});
	},
});

