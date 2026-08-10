import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { authors } from "../../../.source/server";

export const authorsSource = loader({
	baseUrl: "/authors",
	source: toFumadocsSource(authors, []),
});
