import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { blog, feed } from "../../../.source/server";

export const blogSource = loader({
	baseUrl: "/blog",
	source: toFumadocsSource(blog, []),
	slugs(file) {
		return [file.data.url.substring(6)];
	},
});

export const feedSource = loader({
	baseUrl: "/blog",
	source: toFumadocsSource(feed, []),
	slugs(file) {
		return [file.data.url.substring(6)];
	},
});
