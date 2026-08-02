import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { pages } from "$/.source/server";

export const pagesSource = loader({
	baseUrl: "/pages",
	source: toFumadocsSource(pages, []),
});
