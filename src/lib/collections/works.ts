import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { works } from "$/.source/server";

export const worksSource = loader({
	baseUrl: "/works",
	source: toFumadocsSource(works, []),
});
