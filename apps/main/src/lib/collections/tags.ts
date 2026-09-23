import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { tags } from "../../../.source/server";

export const tagsSource = loader({
	baseUrl: "/tags",
	source: toFumadocsSource(tags, []),
});
