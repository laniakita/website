import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { categories } from "$/.source/server";

export const categoriesSource = loader({
	baseUrl: "/categories",
	source: toFumadocsSource(categories, []),
});
