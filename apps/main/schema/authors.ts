import { defineCollections } from "fumadocs-mdx/config";
import * as v from "valibot";
import { defaultCreatedAt, optionalDate } from "./shared";

export const authors = defineCollections({
	dir: "./content/authors",
	type: "doc",
	schema: (ctx) => {
		return v.object({
			createdAt: defaultCreatedAt,
			lastModified: optionalDate,
			name: v.string(),
			bluesky: v.optional(v.string()),
			mastodon: v.optional(v.string()),
			github: v.optional(v.string()),
			url: v.optional(
				v.string(),
				() => `${ctx.path.split("content").pop()?.split(".").shift()}`,
			),
		});
	},
});
