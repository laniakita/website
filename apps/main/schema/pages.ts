import { defineCollections } from "fumadocs-mdx/config";
import * as v from "valibot";
import { defaultCreatedAt, optionalDate } from "./shared";

export const pages = defineCollections({
	dir: "./.content/pages",
	type: "doc",
	postprocess: {
		includeProcessedMarkdown: true,
	},
	schema: (ctx) => {
		return v.object({
			title: v.string(),
			description: v.optional(v.string()),
			createdAt: defaultCreatedAt,
			lastModified: optionalDate,
			url: v.optional(
				v.string(),
				() => `${ctx.path.split(".content").pop()?.split(".").shift()}`,
			),
		});
	},
});

