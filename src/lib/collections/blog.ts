import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { blog, feed } from "$/.source/server";

export const blogSource = loader({
	baseUrl: "/blog",
	source: toFumadocsSource(blog, []),
});

export const feedSource = loader({
	baseUrl: "/feed",
	source: toFumadocsSource(feed, []),
});
